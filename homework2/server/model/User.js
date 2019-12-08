const scheme = () => `
    CREATE TABLE IF NOT EXISTS user(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    account varchar(16) NOT NULL
);
`;

const insert = account => `
    insert into user (account) values ('${account}');
`;

const select = name => `
    select * from user where name='${name}'
`;

const selectAll = () => `
    select * from user;
`;

export { scheme };