const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "zelda12345",
    database: "CMS",
})
connection.connect((err) => {
    if (err){
        throw err;
    }
})

module.exports = connection;

