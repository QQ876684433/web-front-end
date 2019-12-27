import {addController, GET, POST} from "./Common";

const getProgressiveImage = (req, res) => {
    
};

const routes = [];
addController(routes, GET, '/img/progressive', getProgressiveImage);

export default routes;
