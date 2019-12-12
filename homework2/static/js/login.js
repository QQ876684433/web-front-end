import {aesEncrypt} from '../../server/security/AES-es5';
import {getKeyPair, rsaEncrypt, rsaSign} from '../../server/security/RSA-es5';

window.onload = () => {
    const loginButton = document.getElementById('login-action');

    const onLogin = () => {
        const username = document.getElementById('input-username').value;
        const password = document.getElementById('input-password').value;
        new Promise((resolve, reject) => {
            // 客户端(client)生成自己的密钥对
            const [publicKey, privateKey] = getKeyPair();
            console.log(publicKey);
            console.log(privateKey);
            if (publicKey && privateKey) {
                resolve([publicKey, privateKey]);
            } else {
                reject('生成密钥对失败！');
            }
        }).then(keyPair => {
            const [publicKey, privateKey] = keyPair;
            // server和client分别交换自己的公钥
            fetch('/user/login', {
                body: JSON.stringify({stage: 1, publicKey: publicKey}),
                method: 'POST',
            }).then(resp => resp.json()).then(data => {
                console.log(data);
                if (data.ok) {
                    // 获取服务端的公钥
                    const serverPub = data.publicKey;
                    // client生成AES密钥(aesKey)
                    const aesKey = '1';
                    // client使用自己的RSA私钥(privateKey)对请求明文数据(params)进行数字签名
                    const params = JSON.stringify({username: username, password: password});
                    const signature = rsaSign(params, privateKey);
                    // 将签名加入到请求参数中，然后转换为json格式
                    const body = JSON.stringify({params: params, signature: signature});
                    // client使用aesKey对json数据进行加密得到密文(data)
                    const encryptedBody = aesEncrypt(body, aesKey);
                    // client使用sever的RSA公钥对aesKey进行加密(encryptkey)
                    const encryptedKey = rsaEncrypt(aesKey, serverPub);
                    // 分别将data和encryptkey作为参数传输给服务器端
                    const reqBody = JSON.stringify({stage: 2, data: encryptedBody, aesKey: encryptedKey});
                    fetch('/user/login', {
                        body: reqBody,
                        method: 'POST',
                    }).then(resp => resp.json()).then(data => {
                        if (data.ok) {
                            // 注册成功
                            alert('用户登录成功!');
                            window.location.href = '/';
                        } else {
                            alert('用户登录失败失败!');
                        }
                    });
                } else {
                    alert('获取服务端公钥失败!');
                }
            });
        });
    };

    loginButton.onclick = onLogin;
};
