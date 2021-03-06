import {aesEncrypt} from '../../server/security/AES-es5';
import {getKeyPair, rsaEncrypt, rsaSign} from '../../server/security/RSA-es5';


// 用户名验证
const usernameCheck = (username, usernameNotification) => {
    username = username.value;
    if (!username) {
        usernameNotification.innerText = 'cannot be empty!';
        usernameNotification.style.visibility = 'visible';
        return false;
    } else {
        usernameNotification.style.visibility = 'hidden';
        return true;
    }
};

// 密码验证
const passwordCheck = (password, passwordNotification, togglePassword) => {
    password = password.value;
    if (!password) {
        passwordNotification.innerText = 'cannot be empty!';
        passwordNotification.style.visibility = 'visible';
        togglePassword.style.display = 'none';
        passwordNotification.style.display = 'block';
        return false;
    } else {
        passwordNotification.style.display = 'none';
        togglePassword.style.display = 'block';
        return true;
    }
};


// 表单验证
const formCheck = (username,
                   password,
                   usernameNotification,
                   passwordNotification,
                   togglePassword) => {
    const res1 = usernameCheck(username, usernameNotification);
    const res2 = passwordCheck(password, passwordNotification, togglePassword);
    return res1 && res2;
};

window.onload = () => {
    const loginButton = document.getElementById('login-action');
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('input-password');
    const usernameInput = document.getElementById('input-username');
    const usernameNotification = document.getElementById('username-notification');
    const passwordNotification = document.getElementById('password-notification');
    const loginResult = document.getElementById('login-result');

    // 绑定失去焦点事件
    usernameInput.onblur = () => usernameCheck(usernameInput, usernameNotification);
    passwordInput.onblur = () => passwordCheck(passwordInput, passwordNotification, togglePassword);

    const onLogin = () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        if (!formCheck(usernameInput, passwordInput, usernameNotification, passwordNotification, togglePassword)) {
            return;
        }

        // 添加Pending提示
        let counter = 0;
        const arr = ['.', '..', '...'];
        const interval = setInterval(() => {
            loginResult.style.visibility = 'visibility';
            loginButton.innerText = `Pending${arr[counter++ % 3]}`;
        }, 200);
        const closeInterval = () => {
            loginButton.innerText = `Sign In`;
            clearInterval(interval);
        };

        new Promise((resolve, reject) => {
            // 客户端(client)生成自己的密钥对
            const [publicKey, privateKey] = getKeyPair();
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
                        closeInterval();
                        if (data.ok) {
                            // 注册成功
                            loginResult.innerText = 'Sign in successfully!';
                            window.location.href = '/';
                        } else {
                            const message = data.message;
                            if (message.content) {
                                usernameNotification.innerText = message.content;
                                usernameNotification.style.visibility = 'visible';
                            } else {
                                loginResult.innerText = message.other;
                            }
                        }
                    });
                } else {
                    closeInterval();
                    loginResult.innerText = 'login failed!';
                    console.log('获取服务端公钥失败!');
                }
            });
        });
    };
    const onTogglePassword = () => {
        const type = passwordInput.getAttribute('type');
        if (type === 'password') {
            passwordInput.setAttribute('type', 'text');
            togglePassword.innerText = 'hide password';
        } else {
            passwordInput.setAttribute('type', 'password');
            togglePassword.innerText = 'show password';
        }
    };

    loginButton.onclick = onLogin;
    togglePassword.onclick = onTogglePassword;
};
