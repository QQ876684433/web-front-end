import {serialize, setCookie} from "../core/util";

const sessions = {};
const key = 'chph_uid';
const EXPIRES = 20 * 60 * 1000;

const generate = () => {
    const session = {};
    session.id = (new Date()).getTime() + Math.random();
    session.cookie = {
        expire: (new Date()).getTime() + EXPIRES
    };
    sessions[session.id] = session;
    return session;
};

// session鉴权中间件
const getSession = (req, res, next) => {
    const id = req.cookies[key];
    if (!id) {
        req.session = generate();
    } else {
        const session = sessions[id];
        if (session) {
            if (session.cookie.expire > (new Date()).getTime()) {
                // 更新超时时间
                session.cookie.expire = (new Date()).getTime() + EXPIRES;
                req.session = session;
            } else {
                // 超时了，删除旧数据，并重新生成
                delete sessions[id];
                req.session = generate();
            }
        } else {
            // 如果session过期或者口令不对，重新生成session
            req.session = generate();
        }
    }
    console.log("[session]");
    console.log(req.session);
    next();
};

// 通过hack响应对象的writeHead()方法
// 实现在响应客户端时设置新的session值
const setSession = (req, res, next) => {
    // const writeHead = res.writeHead;
    // res.writeHead = () => {
    // let cookies = res.getHeader('Set-Cookie');
    // const session = serialize(key, req.session.id);
    // cookies = Array.isArray(cookies) ? cookies.concat(session) : [cookies, session];
    // res.setHeader('Set-Cookie', cookies);
    // return writeHead.apply(this, arguments);
    // };
    setCookie(res, key, req.session.id);
    next();
};

export {getSession, setSession};
