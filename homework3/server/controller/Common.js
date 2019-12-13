const GET = 'get';
const POST = 'post';

const addController = (routes, method, url, handler) => {
    routes.push({ method: method, url: url, handler: handler });
};

export {addController, GET, POST};