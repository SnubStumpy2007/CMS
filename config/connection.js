const mysql = require('mysql2/promise');


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "zelda12345",
    database: "CMS",
})

module.exports = connection;

