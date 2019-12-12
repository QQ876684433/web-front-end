import chph from "./core/chph";
import {logger, parseCookie, queryString, auth, postBody} from "./core/middleware";
import {getSession, setSession} from './security/session';
import _404 from './controller/404';
import {connect, close} from "./model/Connect";
import {redirectToHomePage, redirectToIndex, redirectToLogin, redirectToRegister} from "./controller/Redirect";
import UserRoutes from './controller/UserController';

const host = "127.0.0.1";
const port = 2333;

// connect to database
connect('user');
const app = chph();
app.setStatic('/home/steve/Documents/Projects/web-front-end/homework2/static');

app.use('/', logger);
app.use('/', queryString);
app.use('/', parseCookie);
app.use('/', postBody);
app.use('/', getSession);
app.use('/', setSession);
app.use('/index', auth);

app.get('/', redirectToIndex);
app.get('/index', redirectToHomePage);
app.get('/login', redirectToLogin);
app.get('/register', redirectToRegister);

for (let route of UserRoutes){
    app[route.method](route.url, route.handler);
}

app.all('*', _404);

app.listen(port, host, [close]);
