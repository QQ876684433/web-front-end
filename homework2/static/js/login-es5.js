'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _AESEs = require('../../server/security/AES-es5');

var _RSAEs = require('../../server/security/RSA-es5');

// 用户名验证
var usernameCheck = function usernameCheck(username, usernameNotification) {
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
var passwordCheck = function passwordCheck(password, passwordNotification, togglePassword) {
    password = password.value;
    if (!password) {
        passwordNotification.innerText = 'cannot be empty!';
        passwordNotification.style.visibility = 'visible';
        togglePassword.style.display = 'none';
        passwordNotification.style.display = '';
        return false;
    } else {
        passwordNotification.style.display = 'none';
        togglePassword.style.display = '';
        return true;
    }
};

// 表单验证
var formCheck = function formCheck(username, password, usernameNotification, passwordNotification, togglePassword) {
    var res1 = usernameCheck(username, usernameNotification);
    var res2 = passwordCheck(password, passwordNotification, togglePassword);
    return res1 && res2;
};

window.onload = function () {
    var loginButton = document.getElementById('login-action');
    var togglePassword = document.getElementById('toggle-password');
    var passwordInput = document.getElementById('input-password');
    var usernameInput = document.getElementById('input-username');
    var usernameNotification = document.getElementById('username-notification');
    var passwordNotification = document.getElementById('password-notification');

    // 绑定失去焦点事件
    usernameInput.onblur = function () {
        return usernameCheck(usernameInput, usernameNotification);
    };
    passwordInput.onblur = function () {
        return passwordCheck(passwordInput, passwordNotification, togglePassword);
    };

    var onLogin = function onLogin() {
        var username = usernameInput.value;
        var password = passwordInput.value;
        if (!formCheck(usernameInput, passwordInput, usernameNotification, passwordNotification, togglePassword)) {
            return;
        }
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


            fetch('/user/login', {
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
                    fetch('/user/login', {
                        body: reqBody,
                        method: 'POST'
                    }).then(function (resp) {
                        return resp.json();
                    }).then(function (data) {
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
    var onTogglePassword = function onTogglePassword() {
        var type = passwordInput.getAttribute('type');
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
