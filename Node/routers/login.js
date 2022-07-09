// Calling libraries
const express = require('express'); // Express web server framework
const router = express.Router(); // Express router
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
})

router.get('/', (req, res, next) => { // Get login page
    console.log('GET /login');
    next(); // Next function
}, (req,res) => {
    res.render('login', {error : '', mensaje: ''}); // Render login page
})

router.post('/', (req, res, next) => { // Post login page
    console.log('POST /login');
    const id_usuario = parseInt(req.body.documento_id); // Get id from form
    const password = req.body.Contraseña; // Get password from form

    let sql_search = `SELECT * FROM registro WHERE R_num_documento = ${id_usuario};`; // Format query
    
    let query = mysql.format(sql_search); // Format query
    console.log(query);
    db.getConnection((err, connection) => { // Get connection from database
    if (err) throw err;
    console.log('Conexion establecida');
    connection.query(query, (err, rows) => {    // Query database
        if (err) throw err;
        if (rows.length > 0) { // If user exists
            var resultado = rows;
            console.log(resultado);
            if(resultado[0].R_contraseña == password){ // Check if password is correct

                req.session.loggedin = true; // Set session loggedin to true
                req.session.usr = resultado[0].R_num_documento; // Set session id to user id
                req.session.nombre = resultado[0].R_nombres; // Set session nombre to user nombre

                console.log('Contraseña correcta, redireccionando a la pagina principal');
                res.redirect('/dashboard'); // Redirect to dashboard
            }
            else{ // If password is incorrect
                console.log('Contraseña incorrecta'); 
                res.render('login', { error:'Contraseña Incorrecta', mensaje: 'Intente de nuevo'}) // Send error, password is incorrect
            }
        }
        else {
            res.render('login', {error : 'Usuario No registrado', mensaje: 'Regístrece abajo'}) // Send error if user doesn't exist
            console.log('Usuario no registrado');
        }
    })
    })
});

router.get('/out', (req,res) => {
    req.session.loggedin = false; // Set session loggedin to false
    req.session.destroy(); // Destroy session
    res.redirect('/login'); // Redirect to login page
}) // Get logout page)

module.exports = router; // Export router