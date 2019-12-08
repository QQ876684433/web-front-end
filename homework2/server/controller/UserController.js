import {addController, GET, POST} from './Common';

const login = (req, res) => {
    
};

const routes = [];
addController(routes, POST, '/user/login', login);

export default routes;