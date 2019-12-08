import chph from "./core/chph";
import { logger, parseCookie, queryString } from "./core/middleware";
import _404 from './controller/404';
import { connect, close } from "./model/Connect";

const host = "127.0.0.1";
const port = 2333;

// connect to database
connect('user');
const app = chph();
app.setStatic('/home/steve/Documents/Projects/web-front-end/homework2/static');

app.use('/', logger);
app.use('/', queryString);
app.use('/', parseCookie);

const redirectToIndex = (req, res) => {
    res.writeHead(302, { 'Location': '/index.html' });
    res.end();
};
app.all('/', redirectToIndex);
app.all('*', _404);

app.listen(port, host, [close]);
