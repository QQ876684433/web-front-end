import {getDatabase} from "./Connect";
import * as user from "./User";

const db = getDatabase('user');

const getUserByUsername = (account, callback) => {
    db.get(`${user.select(account)}`, (err, row) => {
        if (err) {
            console.log('failed to get user!');
            console.log(err);
        } else {
            console.log(`get user successfully:\t${row}`);
        }
        callback(err, row);
    });
};

const addUser = (account, password, callback) => {
    db.run(`${user.insert(account, password)}`, (err, row) => {
        if (err) {
            console.log(`failed to add user '${account}'!`);
            console.log(err);
        } else {
            console.log(`add user '${account}' successfully!`);
        }
        callback(err, row);
    });
};

export {getUserByUsername, addUser};
