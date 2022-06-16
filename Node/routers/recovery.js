// Calling libraries
const express = require('express'); // Express web server framework
const router = express.Router(); // Express router
const fs = require('fs'); // File system library
const mysql = require('mysql'); // MySQL library

// Connect to database
const db =  mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'Mphr_2015',
    database: 'registro_BD',
    port : 3306
});

// Get connection from database
db.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Base de datos conectada');
});

router.get('/', (req, res, next) => {
    let data_null_tmp ={
        'id': 0,
        'estado': 'inactivo'
    };
    let data_null = JSON.stringify(data_null_tmp);
    fs.writeFileSync('data/datos_sesion.json', data_null, (error)=>{
        if(error){
            console.log(error);
        }
        else{
            console.log('Archivo editado a 0');
        }
    });
    next();
}, (req,res)=>{
    res.render('recovery', {error : ''});
}); // Get recovery page

router.post('/', async (req,res)=>{
    console.log('POST /recovery');
    const data = req.body;
    var id = data.documento_id;
    var contraseña = data.Contraseña;

    var sql = 'SELECT * FROM registro WHERE R_num_documento = ?';
    var query = mysql.format(sql, [id]);

    var usr = await new Promise ( exists => { db.getConnection((err, connection) => {
        if (err) throw err;
        connection.query(query, (err, rows) => {
            if (err) throw err;
            if(rows.length > 0){
                console.log('Usuario encontrado');
                exists(true);
            }
            else{
                console.log('Usuario no encontrado');
                res.render('recovery', {error : 'El usuario no existe'});
                exists(false);
            }
        })
    })});
    if(usr){
        var sql_2 = 'UPDATE registro SET R_contraseña = ? WHERE R_num_documento = ?';
        var query_2 = mysql.format(sql_2, [contraseña, id]);
        db.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(query_2, (err, rows) => {
                if (err) throw err;
                console.log('Contraseña actualizada');
                res.redirect('/login');
            })
        })
    }
});

module.exports = router;