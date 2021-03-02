let mysql=require('mysql')
let connection=mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'dgm199708',
    database : 'graduation'
});
connection.connect()
module.exports=connection