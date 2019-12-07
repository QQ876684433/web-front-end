import {getTimestamp} from "./util";
import url from 'url';

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
        req.cookie = cookies;
    }
    next();
};

const queryString = (req, res, next) => {
    req.query = url.parse(req.url, true).query;
    next();
};

export {logger, parseCookie, queryString};
