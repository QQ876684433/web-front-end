const serverPublicKey = 'server_public_key';
const localPrivateKey = 'local_private_key';
const localAesKey = 'local_aes_key';

const setServerPublicKey = key => {
    sessionStorage.setItem(serverPublicKey, key);
};

const getServerPublicKey = () => {
    return sessionStorage.getItem(serverPublicKey);
};

const setLocalPrivateKey = key => {
    sessionStorage.setItem(localPrivateKey, key);
};

const getLocalPrivateKey = () => {
    return sessionStorage.getItem(localPrivateKey);
};

const setLocalAesKey = key => {
    sessionStorage.setItem(localAesKey, key);
};

const getLocalAesKey = () => {
    return sessionStorage.getItem(localAesKey);
};

const getSessionStorageItems = () => {
    return [getServerPublicKey(), getLocalPrivateKey(), getLocalAesKey()];
};

// console.log(getSessionStorageItems());

export {
    setServerPublicKey,
    setLocalAesKey,
    setLocalPrivateKey,
    getLocalAesKey,
    getLocalPrivateKey,
    getServerPublicKey,
    getSessionStorageItems
};
