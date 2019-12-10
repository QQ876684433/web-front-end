import {getTimestamp} from "./util";
import url from 'url';
import {redirectToLogin} from "../controller/Redirect";

const logger = (req, res, next) => {
    console.log(`[LOG] ${getTimestamp()} : ${req.url}`);
    next();
};

const parseCookie = (req, res, next) => {
    const cookies = {};
    const rawCookie = req.headers.cookie;
    if (rawCookie) {
        const list = rawCookie.split(';');
        for (let i = 0; i < list.length; i++) {
            const pair = list[i].split('=');
            cookies[pair[0].trim()] = pair[1];
        }
    }
    req.cookies = cookies;
    console.log("[cookie]");
    console.log(cookies);
    next();
};

const queryString = (req, res, next) => {
    req.query = url.parse(req.url, true).query;
    next();
};

const postBody = (req, res, next) => {
    if (req.method.toLowerCase() === 'post') {
        let content = "";
        req.on('data', function (chunk) {
            content += chunk;
        });
        req.on('end', () => {
            req.body = content;
            next();
        });
    } else {
        req.body = '{}';
        next();
    }
};

const auth = (req, res, next) => {
    if (!req.session.auth) {
        // 尚未登录
        redirectToLogin(req, res);
    } else {
        // 已经登录，放行
        next();
    }
};

export {logger, parseCookie, queryString, postBody, auth};
