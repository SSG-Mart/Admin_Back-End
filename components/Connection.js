const mysql = require('mysql');

try{
    var con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'ssg_mart'
    });

    con.connect((err) => {
        if(err) throw err;
        console.log('Connected to MySQL');
    });
}
catch{
    console.log('Error connecting to MySQL');
}

module.exports = con;