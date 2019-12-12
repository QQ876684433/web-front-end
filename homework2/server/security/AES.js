const crypto = require('crypto');

const aes192 = 'aes192';

const aesEncrypt = (data, key) => {
    // 如果密码不需要初始化向量，则 iv 可以为 null
    const cipher = crypto.createCipher(aes192, key);
    let crypted = cipher.update(data, 'utf8', 'binary');
    crypted += cipher.final('binary');
    return crypted;
};

const aesDecrypt = (encrypted, key) => {
    const decipher = crypto.createDecipher(aes192, key);
    let decrypted = decipher.update(encrypted, 'binary', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

export {aesDecrypt, aesEncrypt};
