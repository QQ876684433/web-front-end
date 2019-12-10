const redirectToIndex = (req, res) => {
    res.writeHead(302, {'Location': '/index'});
    res.end();
};

const redirectToHomePage = (req, res) => {
    res.writeHead(302, {'Location': '/index.html'});
    res.end();
};

const redirectToLogin = (req, res) => {
    res.writeHead(302, {'Location': '/login.html'});
    res.end();
};

const redirectToRegister = (req, res) => {
    res.writeHead(302, {'Location': '/register.html'});
    res.end();
};

export {redirectToIndex, redirectToLogin, redirectToRegister, redirectToHomePage};
