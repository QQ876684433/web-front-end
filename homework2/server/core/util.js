const getTimestamp = () => new Date();

const serialize = (name, val, opt) => {
    const pairs = [name + '=' + val];
    opt = opt || {};
    if (opt.maxAge) pairs.push('Max-Age=' + opt.maxAge);
    if (opt.domain) pairs.push('Domain=' + opt.domain);
    if (opt.path) pairs.push('Path=' + opt.path);
    if (opt.expires) pairs.push('Expires=' + opt.expires.toUTCString());
    if (opt.httpOnly) pairs.push('HttpOnly');
    if (opt.secure) pairs.push('Secure');
    return pairs.join('; ');
};

const setCookie = (res, name, val)=>{
    let cookies = res.getHeader('Set-Cookie');
    const session = serialize(name, val);
    cookies = Array.isArray(cookies) ? cookies.concat(session) : [cookies, session];
    res.setHeader('Set-Cookie', cookies);
};

export {getTimestamp, serialize, setCookie};
