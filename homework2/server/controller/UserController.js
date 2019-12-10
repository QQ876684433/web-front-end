import {addController, GET, POST} from './Common';

const login = (req, res) => {
    req.session.auth = 1;
    res.writeHead(200);
    res.end();
};

const register = (req, res) => {
    res.writeHead(200);
    res.end();
};

const routes = [];
addController(routes, POST, '/user/login', login);
addController(routes, POST, '/user/register', register);

export default routes;
