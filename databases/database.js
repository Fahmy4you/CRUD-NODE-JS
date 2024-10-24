const mysql = require("mysql2");
  
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'node_crud',
})

module.exports = {
  conn,
}
