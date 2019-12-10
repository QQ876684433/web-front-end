const scheme = () => `
    CREATE TABLE IF NOT EXISTS user(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    account varchar(16) NOT NULL,
    password varchar(255) NOT NULL
);
`;

const insert = (account, password) => `
    insert into user (account, password) values ('${account} ${password}');
`;

const select = name => `
    select * from user where name='${name}'
`;

const selectAll = () => `
    select * from user;
`;

export { scheme };
