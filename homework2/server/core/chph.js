import * as http from "http";
import * as url from "url";
import * as path from "path";
import { handleStatic } from "./mime";

const app = {};
app.routes = [];
const methods = ['get', 'post', 'put', 'options', 'delete', 'all', 'use'];
methods.forEach((method) => {
    app[method] = (path, fn) => {
        app.routes.push({
            method: method,
            path: path,
            fn: fn
        })
    }
});
app.use = (path, fn) => {
    app.routes.push({
        method: 'use',
        path: path,
        fn: fn
    })
};

const lazy = function* (arr) {
    yield* arr;
};
const replaceParams = (path) => new RegExp(`\^${path.replace(/:\w[^\/]+/g, '\\w[^\/]+')}\$`);
const passRouter = (routes, method, path) => (req, res) => {
    const lazyRoutes = lazy(routes);
    (function next() {
        const it = lazyRoutes.next().value;
        if (!it) {
            res.end(`Cannot ${method} ${path}\n`);
        } else if (it.method === 'use'
            && (it.path === '/' || it.path === path || path.startsWith(it.path.concat('/')))) {
            it.fn(req, res, next);
        } else if ((it.method === method || it.method === 'all')
            && (it.path === path || it.path === '*')) {
            it.fn(req, res);
        } else if (it.path.includes(':')
            && (it.method === method || it.method === 'all')
            && (replaceParams(it.path).test(path))) {
            let index = 0;
            const param2Array = it.path.split('/');
            const path2Array = path.split('/');
            const params = {};
            param2Array.forEach(path => {
                if (/:/.test(path)) {
                    params[path.slice(1)] = path2Array[index];
                }
                index++;
            });
            req.params = params;
            it.fn(req, res);
        } else {
            next();
        }
    }());
};

let _static = 'static';
app.setStatic = path => {
    _static = path;
};
app.listen = (port, host, callbacks = []) => {
    http.createServer(((req, res) => {
        const method = req.method.toLowerCase();
        const urlObj = url.parse(req.url, true);
        const pathname = urlObj.pathname;
        const ext = path.extname(pathname).slice(1);
        if (ext) {
            handleStatic(res, _static + pathname, ext);
        } else {
            const router = passRouter(app.routes, method, pathname);
            router(req, res);
        }
    })).listen(port, host, () => {
        console.log(`Server now running on http://${host}:${port}/\n`);
        process.stdin.resume();
        process.on('SIGINT', () => {
            for (let callback of callbacks) {
                callback();
            }
            console.log('\n');
            console.log('Server shutdown!\n');
            process.exit(2);
        });
    });
};

const chph = () => app;
export default chph;

