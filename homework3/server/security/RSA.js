const crypto = require('crypto');
const NodeRSA = require('node-rsa');


const getKeyPair = () => {
    const rsa = new NodeRSA({b: 1024});
    const publicKey = rsa.exportKey('pkcs1-public-pem');
    const privateKey = rsa.exportKey('pkcs1-private-pem');
    return [publicKey, privateKey];
};

const rsaEncrypt = (data, publicKey) => {
    return crypto.publicEncrypt(publicKey, Buffer.from(data));
};

const rsaDecrypt = (data, privateKey) => {
    return crypto.privateDecrypt(privateKey, data);
};

const rsaSign = (data, privateKey) => {
    let sign;
    try {
        sign = crypto.createSign('RSA-SHA1');
    }catch (e) {
        console.log(e);
    }
    sign.write(data);
    sign.end();
    return sign.sign(privateKey);
};

const rsaVerify = (data, signature, publicKey) => {
     const verify = crypto.createVerify('RSA-SHA1');
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

export {getKeyPair, rsaEncrypt, rsaDecrypt, rsaSign, rsaVerify};
