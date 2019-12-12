const scheme = () => `
    CREATE TABLE IF NOT EXISTS user(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    account varchar(16) NOT NULL,
    password varchar(255) NOT NULL
);
`;

const insert = (account, password) => `
    insert into user (account, password) values ('${account}', '${password}');
`;

const select = account => `
    select account, password from user where account='${account}';
`;

const selectAll = () => `
    select * from user;
`;

export { scheme, insert, select, selectAll };
