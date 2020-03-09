var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '000000',
  database : 'food'
});
 
connection.connect();
 
connection.query(`SELECT id FROM user WHERE name = 'peter04'`, function (error, results, fields) {
  console.log(results[0]);
})

connection.end();