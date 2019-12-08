import chph from "./core/chph";
import {logger, parseCookie, queryString} from "./core/middleware";
import _404 from './controller/404';

const host = "127.0.0.1";
const port = 2333;

const app = chph();

app.use('/', logger);
app.use('/', queryString);
app.use('/', parseCookie);



app.all('*', _404);

app.listen(port, host);
