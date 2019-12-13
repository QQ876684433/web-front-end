import crypto from 'crypto';

const algorithm = 'md5';

const hash = (data, format) => {
    const h = crypto.createHash(algorithm);
    h.update(data, 'utf8');
    return h.digest(format || 'hex');
};

const reinforcedHash = (data, salt, format) => {
    return hash(salt + hash(data, format));
};

// console.log(reinforcedHash('chph', '123456'));

export {hash, reinforcedHash};
