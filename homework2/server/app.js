import chph from "./core/chph";
import {logger, parseCookie, queryString} from "./core/middleware";
import {cookieSerialize} from "./core/util";

const host = "127.0.0.1";
const port = 2333;

const app = chph();

const hello = function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Set-Cookie': cookieSerialize('user', 'steve')
    });
    if (req.cookie) {
        res.write('cookie\n');
        console.log(req.cookie);
    }
    if (req.query) {
        res.write('query\n');
        console.log(req.query);
    }
    if (req.params && req.params.username) {
        res.end('Hello ' + req.params.username + '!\n');
    } else {
        res.end('Hello Nodejs!\n');
    }
};

const welcome = (req, res) => {
    res.end('welcome to chph!');
};

const handle404 = (req,res)=>{
  res.writeHead(404, {'Content-Type':'text/plain'});
  res.end('404 - Page Not Found!\n');
};

app.use('/', logger);
app.use('/', queryString);
app.use('/', parseCookie);
app.get('/', welcome);
app.get('/:username', hello);
app.all('*', handle404);

app.listen(port, host);
