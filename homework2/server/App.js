import chph from "./core/chph";
import {logger, parseCookie, queryString, auth} from "./core/middleware";
import {getSession, setSession} from './security/session';
import _404 from './controller/404';
import {connect, close} from "./model/Connect";
import {redirectToHomePage, redirectToIndex, redirectToLogin, redirectToRegister} from "./controller/Redirect";

const host = "127.0.0.1";
const port = 2333;

// connect to database
connect('user');
const app = chph();
app.setStatic('/home/steve/Documents/Projects/web-front-end/homework2/static');

app.use('/', logger);
app.use('/', queryString);
app.use('/', parseCookie);
app.use('/', getSession);
app.use('/index', auth);
app.use('/', setSession);

app.get('/', redirectToIndex);
app.get('/index', redirectToHomePage);
app.get('/login', redirectToLogin);
app.get('/register', redirectToRegister);
app.all('*', _404);

app.listen(port, host, [close]);
