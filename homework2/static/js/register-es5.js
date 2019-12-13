"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _RSAEs = require("../../server/security/RSA-es5");

var _AESEs = require("../../server/security/AES-es5");

// 用户名验证
var usernameCheck = function usernameCheck(username, usernameNotification) {
    username = username.value;
    if (!username) {
        usernameNotification.innerText = 'cannot be empty!';
    } else {
        if (!/^[_0-9a-zA-Z]+$/.test(username)) {
            usernameNotification.innerText = 'can only be 0-9, a-zA-Z or _ !';
        } else if (/^[a-zA-Z_]+$/.test(username) || /^[0-9_]+$/.test(username)) {
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
var passwordCheck = function passwordCheck(password, passwordNotification) {
    password = password.value;
    if (!password) {
        passwordNotification.innerText = 'cannot be empty!';
    } else {
        var digits = /[0-9]+/;
        var letters = /[a-zA-Z]+/;
        var sign = /[!-/:-@\[-`{-~]+/;
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
var passwordConfirmCheck = function passwordConfirmCheck(password, passwordConfirm, passwordConfirmNotification) {
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
var formCheck = function formCheck(username, password, passwordConfirm, usernameNotification, passwordNotification, passwordConfirmNotification) {
    var res1 = usernameCheck(username, usernameNotification);
    var res2 = passwordCheck(password, passwordNotification);
    var res3 = passwordConfirmCheck(password, passwordConfirm, passwordConfirmNotification);
    return res1 && res2 && res3;
};

window.onload = function () {
    var usernameInput = document.getElementById('input-username');
    var passwordInput = document.getElementById('input-password');
    var passwordConfirmInput = document.getElementById('input-password-confirm');
    var registerButton = document.getElementById('register-action');
    var usernameNotification = document.getElementById('username-notification');
    var passwordNotification = document.getElementById('password-notification');
    var passwordConfirmNotification = document.getElementById('password-confirm-notification');
    var registerResult = document.getElementById('register-result');

    // 绑定失去焦点事件
    usernameInput.onblur = function () {
        return usernameCheck(usernameInput, usernameNotification);
    };
    passwordInput.onblur = function () {
        return passwordCheck(passwordInput, passwordNotification);
    };
    passwordConfirmInput.onblur = function () {
        return passwordConfirmCheck(passwordInput, passwordConfirmInput, passwordConfirmNotification);
    };

    var onRegister = function onRegister() {
        var username = usernameInput.value;
        var password = passwordInput.value;
        if (!formCheck(usernameInput, passwordInput, passwordConfirmInput, usernameNotification, passwordNotification, passwordConfirmNotification)) {
            return;
        }

        // 添加Pending提示
        var counter = 0;
        var arr = ['.', '..', '...'];
        var interval = setInterval(function () {
            registerButton.style.visibility = 'visibility';
            registerButton.innerText = "Pending" + arr[counter++ % 3];
        }, 100);
        var closeInterval = function closeInterval() {
            registerButton.innerText = "Sign In";
            clearInterval(interval);
        };

        new Promise(function (resolve, reject) {
            // 客户端(client)生成自己的密钥对
            var _getKeyPair = (0, _RSAEs.getKeyPair)(),
                _getKeyPair2 = _slicedToArray(_getKeyPair, 2),
                publicKey = _getKeyPair2[0],
                privateKey = _getKeyPair2[1];

            console.log(publicKey);
            console.log(privateKey);
            if (publicKey && privateKey) {
                resolve([publicKey, privateKey]);
            } else {
                reject('生成密钥对失败！');
            }
        }).then(function (keyPair) {
            var _keyPair = _slicedToArray(keyPair, 2),
                publicKey = _keyPair[0],
                privateKey = _keyPair[1];
            // server和client分别交换自己的公钥


            fetch('/user/register', {
                body: JSON.stringify({ stage: 1, publicKey: publicKey }),
                method: 'POST'
            }).then(function (resp) {
                return resp.json();
            }).then(function (data) {
                console.log(data);
                if (data.ok) {
                    // 获取服务端的公钥
                    var serverPub = data.publicKey;
                    // client生成AES密钥(aesKey)
                    var aesKey = '1';
                    // client使用自己的RSA私钥(privateKey)对请求明文数据(params)进行数字签名
                    var params = JSON.stringify({ username: username, password: password });
                    var signature = (0, _RSAEs.rsaSign)(params, privateKey);
                    // 将签名加入到请求参数中，然后转换为json格式
                    var body = JSON.stringify({ params: params, signature: signature });
                    // client使用aesKey对json数据进行加密得到密文(data)
                    var encryptedBody = (0, _AESEs.aesEncrypt)(body, aesKey);
                    // client使用sever的RSA公钥对aesKey进行加密(encryptkey)
                    var encryptedKey = (0, _RSAEs.rsaEncrypt)(aesKey, serverPub);
                    // 分别将data和encryptkey作为参数传输给服务器端
                    var reqBody = JSON.stringify({ stage: 2, data: encryptedBody, aesKey: encryptedKey });
                    fetch('/user/register', {
                        body: reqBody,
                        method: 'POST'
                    }).then(function (resp) {
                        return resp.json();
                    }).then(function (data) {
                        closeInterval();

                        if (data.ok) {
                            // 注册成功
                            registerResult.innerText = 'Sign up successfully!';
                            window.location.href = '/';
                        } else {
                            var message = data.message;
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
                                registerResult.innerText = message.other;
                            }
                        }
                    });
                } else {
                    closeInterval();
                    console.log('获取服务端公钥失败!');
                }
            });
        });
    };

    registerButton.onclick = onRegister;
};
