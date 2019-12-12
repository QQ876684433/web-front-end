'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var crypto = require('crypto');

var aes192 = 'aes192';

var aesEncrypt = function aesEncrypt(data, key) {
    // 如果密码不需要初始化向量，则 iv 可以为 null
    var cipher = crypto.createCipher(aes192, key);
    var crypted = cipher.update(data, 'utf8', 'binary');
    crypted += cipher.final('binary');
    return crypted;
};

var aesDecrypt = function aesDecrypt(encrypted, key) {
    var decipher = crypto.createDecipher(aes192, key);
    var decrypted = decipher.update(encrypted, 'binary', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

exports.aesDecrypt = aesDecrypt;
exports.aesEncrypt = aesEncrypt;
