import {addController, GET, POST} from './Common';
import {addUser, getUserByUsername} from "../model/UserRepo";
import {getKeyPair, rsaDecrypt, rsaVerify} from "../security/RSA";
import {aesDecrypt} from "../security/AES";
import {sessions} from "../security/session";
import {reinforcedHash} from "../security/Hash";

const login = (req, res) => {
    const body = req.body;
    console.log(body);
    if (body.stage === 1) {
        // 交换公钥阶段
        const [pub, pri] = getKeyPair();
        sessions[req.session.id].publicKey = pub;
        sessions[req.session.id].privateKey = pri;
        sessions[req.session.id].clientPub = body.publicKey;
        sessions[req.session.id].auth = 0;
        console.log(sessions[req.session.id]);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(JSON.stringify({ok: 1, publicKey: pub}), 'utf8');
        res.end();
    } else {
        const privateKey = sessions[req.session.id].privateKey;
        const clientPub = sessions[req.session.id].clientPub;

        const aesKey = rsaDecrypt(Buffer.from(body.aesKey.data), privateKey);
        console.log(aesKey);
        const data = JSON.parse(aesDecrypt(body.data, aesKey));
        console.log(data);
        const params = data.params;
        const signature = data.signature;
        const isValid = rsaVerify(params, Buffer.from(signature.data), clientPub);
        if (isValid) {
            // 签名验证通过
            let {username, password} = JSON.parse(params);

            // 用户名和密码格式验证
            if (!username || !password) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.write(JSON.stringify({
                    ok: 0, message: {content: 'wrong username or password', other: ''}
                }), 'utf8');
                res.end();
                return;
            }

            // 计算加盐哈希后的密码的值
            password = reinforcedHash(password, username);
            // 检查用户名和密码是否匹配
            getUserByUsername(username, (err, row) => {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                if (!err && row && row.password === password) {
                    sessions[req.session.id].auth = 1;
                    res.write(JSON.stringify({ok: 1}), 'utf8');
                } else {
                    // 登录失败
                    res.write(JSON.stringify({
                        ok: 0,
                        message: {content: 'wrong username or password', other: ''}
                    }), 'utf8');
                    req.session.auth = 0;
                }
                res.end();
            });
        } else {
            // 签名不正确
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(JSON.stringify({ok: 0, message: {content: '', other: 'signature error!'}}), 'utf8');
            sessions[req.session.id].auth = 0;
            res.end();
        }
    }

};

const register = (req, res) => {
    const body = req.body;
    if (body.stage === 1) {
        // 交换公钥阶段
        const [pub, pri] = getKeyPair();
        sessions[req.session.id].publicKey = pub;
        sessions[req.session.id].privateKey = pri;
        sessions[req.session.id].clientPub = body.publicKey;
        sessions[req.session.id].auth = 0;
        console.log(sessions[req.session.id]);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(JSON.stringify({ok: 1, publicKey: pub}), 'utf8');
        res.end();
    } else {
        const privateKey = sessions[req.session.id].privateKey;
        const clientPub = sessions[req.session.id].clientPub;

        const aesKey = rsaDecrypt(Buffer.from(body.aesKey.data), privateKey);
        console.log(aesKey);
        const data = JSON.parse(aesDecrypt(body.data, aesKey));
        console.log(data);
        const params = data.params;
        const signature = data.signature;
        const isValid = rsaVerify(params, Buffer.from(signature.data), clientPub);
        if (isValid) {
            // 签名验证通过
            let {username, password} = JSON.parse(params);

            // 用户名和密码格式验证
            if (!username
                || !/^[_0-9a-zA-Z]+$/.test(username)
                || (/^[a-zA-Z_]+$/.test(username) || /^[0-9_]+$/.test(username))
                || (username.length < 6 || username.length > 16)) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.write(JSON.stringify({
                    ok: 0, message: {
                        username: 'username is illegal!',
                        password: '',
                        other: ''
                    }
                }), 'utf8');
                res.end();
                return;
            }
            if (!password
                || (password.length < 8 || password.length > 20)
                || !(/[0-9]+/.test(password)
                    && /[a-zA-Z]+/.test(password)
                    && /[!-/:-@\[-`{-~]+/.test(password))
            ) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.write(JSON.stringify({
                    ok: 0, message: {
                        username: '',
                        password: 'password is illegal!',
                        other: ''
                    }
                }), 'utf8');
                res.end();
                return;
            }

            // 用户名是否存在检验
            getUserByUsername(username, (err, row) => {
                if (!err && row) {
                    // 登录失败
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.write(JSON.stringify({
                        ok: 0, message: {
                            username: 'username already exists!',
                            password: '',
                            other: ''
                        }
                    }), 'utf8');
                    res.end();
                } else if (err) {
                    // 出现数据库内部错误
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.write(JSON.stringify({
                        ok: 0, message: {
                            username: '',
                            password: '',
                            other: 'server error!'
                        }
                    }), 'utf8');
                    res.end();
                } else {
                    // 用户名和密码验证通过
                    // 对密码进行哈希并加盐哈希
                    password = reinforcedHash(password, username);
                    // 添加新用户
                    addUser(username, password, (err, row) => {
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        if (!err) {
                            res.write(JSON.stringify({ok: 1}), 'utf8');
                        } else {
                            res.write(JSON.stringify({ok: 0, message: 'register failed!'}), 'utf8');
                        }
                        res.end();
                    });
                }
            });
        } else {
            // 签名不正确
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(JSON.stringify({ok: 0, message: {other: 'signature error!'}}), 'utf8');
            res.end();
        }
    }
};

const routes = [];
addController(routes, POST, '/user/login', login);
addController(routes, POST, '/user/register', register);

export default routes;
