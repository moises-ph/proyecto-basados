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

db.getConnection((err, connection) => {  // Get connection from database
    if (err) throw err;
    console.log('Base de datos conectada');
})


router.get('/', (req, res, next) => { // Get register page
    let data_null_tmp ={
    'id': 0,
    'estado': 'inactivo'
    } // Create data to send to file
    let data_null = JSON.stringify(data_null_tmp); // Parse data to JSON
    fs.writeFileSync('data/datos_sesion.json', data_null, (error)=>{ // Write data to file
        if(error){
            console.log(error);
        }
        else{
            console.log('Archivo editado a 0');
        }});
    next(); // Next function
}, (req,res) => {
    res.render('registro', {error : '', mensaje: ''}); // Render register page
}) 

router.post('/', (req, res, next) => {
    let data_null_tmp ={
    'id': 0,
    'estado': 'inactivo'
    } // Create data to send to file
    let data_null = JSON.stringify(data_null_tmp); // Parse data to JSON
    fs.writeFileSync('data/datos_sesion.json', data_null, (error)=>{ // Write data to file
            if(error){
                console.log(error);
            }
            else{
                console.log('Archivo editado a 0');
            }
            });
    console.log(req);
    const tipo_usuario = req.body.usuario; // Get type from form
    const tipo_documento = req.body.Tipo_documento; // Get type from form
    const documento = req.body.id; // Get id from form
    const nombre = req.body.nombre; // Get name from form
    const apellidos = req.body.Apellidos; // Get last name from form
    const edad = req.body.edad; // Get age from form
    const genero = req.body.Genero; // Get gender from form
    const email = req.body.email; // Get email from form
    const contraseña = req.body.password; // Get password from form

    db.getConnection( (err, connection) => { // Connect to database
    if (err) throw err;
    console.log('Conexion establecida');

    const sql_search = "SELECT * FROM registro WHERE R_num_documento = ?;" // Comand to search user
    const search_sql = mysql.format(sql_search, [documento]); // Format query
    
    // Commando to insert user
    const sql_insert = "INSERT INTO registro(R_num_documento,R_nombres, R_apellidos, R_edad, R_genero, R_email, R_contraseña, R_tipo_de_usuario, R_tipo_de_documento) VALUES (?,?,?,?,?,?,?,?,?);"
    // Format query
    const query_sql = mysql.format(sql_insert, [documento, nombre, apellidos, edad, genero, email, contraseña, tipo_usuario, tipo_documento]);

    connection.query( search_sql,  (err, result) => { // Search user
        if (err) throw err;
        if (result.length > 0) { // If user exists
            console.log('Usuario ya registrado');
            res.render('registro', {error : 'Usuario ya registrado', mensaje: ''}); // Render register page
        }
        else {
        connection.query(query_sql, (err, result) => {
            if (err) throw err;
            console.log('Usuario registrado');
            res.render('registro', {error : '', mensaje: 'Usuario registrado'}); // Render register page
        })

        // Command to insert in database the user information
        let sql_datos_basicos = 'INSERT INTO datos_usuario(DU_num_documento, DU_telefono, DU_direccion, DU_departamento, DU_ciudad, DU_Estado_civil, DU_Estrato_economico, DU_Ocupacion, DU_Regimen_Perteneciente, DU_fecha_de_nacimiento) values (?,?,?,?,?,?,?,?,?,?);';
        let query_datos_basicos = mysql.format(sql_datos_basicos, [documento, 0, 'none', 'none', 'none', 'none', 0, 'none', 'none', '2000-01-01']);
        connection.query(query_datos_basicos, (err, result) => { // Insert data basicos
            if (err) throw err;
            console.log('Datos basicos registrados');
        })
        }
    })
    })
}, (req,res) => {
    res.render("registro", {error : '', mensaje: ''}); // Render register page (next function)
})


module.exports = router; // Export router