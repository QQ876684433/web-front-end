'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var crypto = require('crypto');
var NodeRSA = require('node-rsa');

var getKeyPair = function getKeyPair() {
    var rsa = new NodeRSA({ b: 1024 });
    var publicKey = rsa.exportKey('pkcs1-public-pem');
    var privateKey = rsa.exportKey('pkcs1-private-pem');
    return [publicKey, privateKey];
};

var rsaEncrypt = function rsaEncrypt(data, publicKey) {
    return crypto.publicEncrypt(publicKey, Buffer.from(data));
};

var rsaDecrypt = function rsaDecrypt(data, privateKey) {
    return crypto.privateDecrypt(privateKey, data);
};

var rsaSign = function rsaSign(data, privateKey) {
    var sign = void 0;
    try {
        sign = crypto.createSign('RSA-SHA1');
    } catch (e) {
        console.log(e);
    }
    sign.write(data);
    sign.end();
    return sign.sign(privateKey);
};

var rsaVerify = function rsaVerify(data, signature, publicKey) {
    var verify = crypto.createVerify('RSA-SHA1');
    verify.write(data);
    verify.end();
    return verify.verify(publicKey, signature);
};

// const [pub, pri] = getKeyPair();
// const data = 'chph';
// const sig = JSON.stringify(rsaSign(data, pri));
// console.log(sig);
// console.log(rsaVerify(data, Buffer.from(JSON.parse(sig).data), pub));
// const a = JSON.stringify(rsaEncrypt(Buffer.from(data), pub));
// console.log(Buffer.from(JSON.parse(a).data));
// console.log(rsaDecrypt(Buffer.from(JSON.parse(a).data), pri).toString('utf8'));

exports.getKeyPair = getKeyPair;
exports.rsaEncrypt = rsaEncrypt;
exports.rsaDecrypt = rsaDecrypt;
exports.rsaSign = rsaSign;
exports.rsaVerify = rsaVerify;
