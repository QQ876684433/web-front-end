import sqlite3, {OPEN_CREATE, OPEN_READWRITE} from 'sqlite3';
import * as user from './User';
import path from 'path';

const sqlite = sqlite3.verbose();
let db;

const connect = database => {
    if (!db) {
        db = new sqlite.Database(path.join(__dirname, `${database}.db`), OPEN_CREATE | OPEN_READWRITE, err => {
            if (err) {
                console.log('failed to open db!');
                console.log(err);
            } else {
                console.log('open db successfully!');
            }
        });
    }
    // 初始化数据表
    db.run(`${user.scheme()}`, (err, row) => {
        if (err) {
            console.log('failed to exec sql!');
            console.log(err);
        } else {
            console.log('exec sql successfully!');
        }
    });
};

const getDatabase = database => {
    if (!db) connect('user');
    return db;
};

const close = () => {
    if (db) {
        db.close(err => {
            if (err) {
                console.log('failed to close db!');
            } else {
                console.log('close db successfully!');
            }
        });
    }
};

export {connect, close, getDatabase};
