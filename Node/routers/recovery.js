// Calling libraries
const express = require('express'); // Express web server framework
const router = express.Router(); // Express router
const fs = require('fs'); // File system library
const mysql = require('mysql'); // MySQL library
const session = require('express-session'); // Express session library

require('dotenv').config();// Load the .env file

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;

// Connect to database
const db = mysql.createPool({
    connectionLimit: 100,
    host: DB_HOST,
    user : DB_USER,
    password : DB_PASSWORD,
    database : DB_DATABASE,
    port: DB_PORT
});

// Get connection from database
db.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Base de datos conectada');
});

router.get('/', (req, res, next) => {
    if(! req.session.loggedin) {
        console.log('GET /recovery');
        next(); // Next function
    }else{
        res.redirect('/dashboard');
    }
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
            console.log(rows + ' ' + id);
            if(rows.length > 0){
                console.log('Usuario encontrado');
                exists(true);
            }
            else{
                console.log('Usuario no encontrado');
                res.json({status: 'Usuario no encontrado'})
                exists(false);
            }
        })
    })});
    if(usr){
        var sql_2 = 'UPDATE registro SET R_contraseña = ? WHERE R_num_documento = ?';
        var query_2 = mysql.format(sql_2, [contraseña[0], id]);
        db.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(query_2, (err, rows) => {
                if (err) throw err;
                console.log('Contraseña actualizada');
                res.json({status: 'Usuario cambiado correctamente'});
            })
        })
    }
});

module.exports = router;