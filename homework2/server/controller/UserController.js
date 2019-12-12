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
            // 计算加盐哈希后的密码的值
            password = reinforcedHash(password, username);
            // 检查用户名和密码是否匹配
            getUserByUsername(username, (err, row) => {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                if (!err && row.password === password) {
                    sessions[req.session.id].auth = 1;
                    res.write(JSON.stringify({ok: 1}), 'utf8');
                } else {
                    // 登录失败
                    res.write(JSON.stringify({ok: 0, message: '用户名或密码不正确'}), 'utf8');
                    req.session.auth = 0;
                }
                res.end();
            });
        } else {
            // 签名不正确
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(JSON.stringify({ok: 0, message: '签名错误'}), 'utf8');
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
            // 对密码进行哈希并加盐哈希
            password = reinforcedHash(password, username);
            // 添加新用户
            addUser(username, password, (err, row) => {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                if (!err) {
                    res.write(JSON.stringify({ok: 1}), 'utf8');
                } else {
                    res.write(JSON.stringify({ok: 0, message: '注册失败!'}), 'utf8');
                }
                res.end();
            });
        } else {
            // 签名不正确
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(JSON.stringify({ok: 0, message: '签名错误'}), 'utf8');
            res.end();
        }
    }
};

const routes = [];
addController(routes, POST, '/user/login', login);
addController(routes, POST, '/user/register', register);

export default routes;
