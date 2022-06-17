// Calling libraries
const express = require('express'); // Express web server framework
const router = express.Router(); // Express router
const fs = require('fs'); // File system library
const mysql = require('mysql'); // MySQL library

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
    let data_null_tmp ={
        'id': 0,
        'estado': 'inactivo'
    } // Create data to send
    let data_null = JSON.stringify(data_null_tmp); // Parse data to JSON
    fs.writeFileSync('data/datos_sesion.json', data_null, (error)=>{ // Write data to file
        if(error){
            console.log(error);
        }
        else{
            console.log('Archivo editado a 0');
        }});
    console.log('GET /login');
    next(); // Next function
}, (req,res) => {
    res.render('login', {error : '', mensaje: ''}); // Render login page
})

router.post('/', (req, res, next) => { // Post login page
    console.log('POST /login');
    let data_null_tmp ={ // Create data to send
    'id': 0,
    'estado': 'inactivo'
    }
    let data_null = JSON.stringify(data_null_tmp); // Parse data to JSON
    fs.writeFileSync('data/datos_sesion.json', data_null, (error)=>{ // Write data to file
            if(error){
                console.log(error);
            }
            else{
                console.log('Archivo editado a 0');
            }
            });
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

                let data_temp = {
                'id' : id_usuario,
                'estado' : 'activo'
                } // Create data to send (id and status are active now) 
                let data = JSON.stringify(data_temp); // Parse data to JSON
                fs.writeFileSync('data/datos_sesion.json', data, (error)=>{ // Write data to file
                if(error){
                    console.log(error);
                }
                else{
                    console.log('Archivo creado');
                }
                });

                res.redirect('/dashboard/'); // Redirect to dashboard 
                console.log('Contraseña correcta, redireccionando a la pagina principal');
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
}, (req,res, mensaje_s) => {
    JSON.parse(mensaje_s);
    res.render('login', {error : mensaje_s.error, mensaje: mensaje_s.mensaje}); // Render login page
})

module.exports = router; // Export router