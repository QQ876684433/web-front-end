import {getKeyPair, rsaEncrypt, rsaSign} from "../../server/security/RSA-es5";
import {aesEncrypt} from "../../server/security/AES-es5";


// 用户名验证
const usernameCheck = (username, usernameNotification) => {
    username = username.value;
    if (!username) {
        usernameNotification.innerText = 'cannot be empty!';
    } else {
        if (!/^[_0-9a-zA-Z]+$/.test(username)) {
            usernameNotification.innerText = 'can only be 0-9, a-zA-Z or _ !';
        } else if (/^[a-zA-Z_]+$/.test(username)
            || /^[0-9_]+$/.test(username)) {
            usernameNotification.innerText = 'must contain numbers and letters!';
        } else if (username.length < 6 || username.length > 16) {
            usernameNotification.innerText = 'must be 6~16 in length!';
        } else {
            usernameNotification.style.visibility = 'hidden';
            return true;
        }
    }
    usernameNotification.style.visibility = 'visible';
    return false;
};

// 密码验证
const passwordCheck = (password, passwordNotification) => {
    password = password.value;
    if (!password) {
        passwordNotification.innerText = 'cannot be empty!';
    } else {
        const digits = /[0-9]+/;
        const letters = /[a-zA-Z]+/;
        const sign = /[!-/:-@\[-`{-~]+/;
        if (password.length < 8 || password.length > 20) {
            passwordNotification.innerText = 'must be 8~20 in length!';
        } else if (!(digits.test(password) && letters.test(password) && sign.test(password))) {
            passwordNotification.innerText = 'must contain numbers, letters, and symbols!';
        } else {
            passwordNotification.style.visibility = 'hidden';
            return true;
        }
    }
    passwordNotification.style.visibility = 'visible';
    return false;
};

// 再次输入密码验证
const passwordConfirmCheck = (password, passwordConfirm, passwordConfirmNotification) => {
    password = password.value;
    passwordConfirm = passwordConfirm.value;
    if (!passwordConfirm) {
        passwordConfirmNotification.innerText = 'cannot be empty!';
    } else if (password !== passwordConfirm) {
        passwordConfirmNotification.innerText = 'inconsistent passwords!';
    } else {
        passwordConfirmNotification.style.visibility = 'hidden';
        return true;
    }
    passwordConfirmNotification.style.visibility = 'visible';
    return false;
};

// 表单验证
const formCheck = (username,
                   password,
                   passwordConfirm,
                   usernameNotification,
                   passwordNotification,
                   passwordConfirmNotification) => {
    const res1 = usernameCheck(username, usernameNotification);
    const res2 = passwordCheck(password, passwordNotification);
    const res3 = passwordConfirmCheck(password, passwordConfirm, passwordConfirmNotification);
    return res1 && res2 && res3;
};

window.onload = () => {
    const usernameInput = document.getElementById('input-username');
    const passwordInput = document.getElementById('input-password');
    const passwordConfirmInput = document.getElementById('input-password-confirm');
    const registerButton = document.getElementById('register-action');
    const usernameNotification = document.getElementById('username-notification');
    const passwordNotification = document.getElementById('password-notification');
    const passwordConfirmNotification = document.getElementById('password-confirm-notification');

    // 绑定失去焦点事件
    usernameInput.onblur = () => usernameCheck(usernameInput, usernameNotification);
    passwordInput.onblur = () => passwordCheck(passwordInput, passwordNotification);
    passwordConfirmInput.onblur = () => passwordConfirmCheck(passwordInput, passwordConfirmInput, passwordConfirmNotification);

    const onRegister = () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        if (!formCheck(usernameInput, passwordInput, passwordConfirmInput, usernameNotification, passwordNotification, passwordConfirmNotification)) {
            return;
        }

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
            fetch('/user/register', {
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
                    fetch('/user/register', {
                        body: reqBody,
                        method: 'POST',
                    }).then(resp => resp.json()).then(data => {
                        if (data.ok) {
                            // 注册成功
                            alert('用户注册成功!');
                            window.location.href = '/';
                        } else {
                            const message = data.message;
                            // 显式错误信息
                            if (message.username) {
                                usernameNotification.style.visibility = 'visible';
                                usernameNotification.innerText = message.username;
                            }
                            if (message.password) {
                                passwordNotification.style.visibility = 'visible';
                                passwordNotification.innerText = message.password;
                            }
                            if (message.other) {
                                alert(message.other);
                            }
                        }
                    });
                } else {
                    alert('获取服务端公钥失败!');
                }
            });
        });
    };

    registerButton.onclick = onRegister;
};
