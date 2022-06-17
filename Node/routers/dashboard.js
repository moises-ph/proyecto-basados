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

// Get dashboard page

router.get('/', async (req, res) => {
    console.log('GET /dashboard');

    // Variables to store data
    var nombre = '';
    var apellido = '';
    var edad = 0;
    var genero = '';
    var telefono = 0;
    var direccion = '';
    var departamento = '';
    var ciudad = '';
    var estado_civil = '';
    var estrato = 0;
    var ocupacion = '';
    var Regimen_Perteneciente = '';
    var fecha_de_nacimiento = '';
    var tipo_documento = '';

    let data = fs.readFileSync('data/datos_sesion.json'); // Read data from file
    let data_json = JSON.parse(data); // Parse data to JSON
    console.log(data_json);
    let id = data_json.id; // Get id from data
    let estado = data_json.estado; // Get estado from data
    if(estado === 'activo'){
        // Get data from database
        let query = "SELECT R_nombres, R_apellidos, R_edad, R_genero, R_tipo_de_documento FROM registro WHERE R_num_documento = ?;"
        let sql_search = mysql.format(query, [id]); // Format query

        let query_2 = 'SELECT DU_telefono, DU_direccion, DU_departamento, DU_ciudad, DU_Estado_civil, DU_Estrato_economico,DU_Ocupacion, DU_Regimen_Perteneciente, date_format(DU_fecha_de_nacimiento, "%Y-%m-%d") as fecha_de_nacimiento from datos_usuario WHERE DU_num_documento = ?;';
        let sql_search_2 = mysql.format(query_2, [id]); // Format query 2
        
        let data1 = await new Promise (peticion => {db.getConnection( (err, connection) => { // Get connection from database
            if (err) throw err;
            console.log('Conexion establecida');
            connection.query(sql_search, (err, rows) => { // Query database
            if (err) throw err;
            if (rows.length > 0) {  // If data is found
                var resultado = rows; // Store data in variable
                nombre = resultado[0].R_nombres; // Get nombre from data
                apellido = resultado[0].R_apellidos; // Get apellido from data
                edad = resultado[0].R_edad; // Get edad from data
                genero = resultado[0].R_genero; // Get genero from data
            peticion({ 
                nombre  : nombre,
                apellido : apellido,
                edad : edad,
                genero : genero,
                tipo_documento : resultado[0].R_tipo_de_documento
                }); // Send data to promise
            }
            })
        })});

        let data2 = await new Promise (peticion => {db.getConnection( (err, connection) => { // Get connection from database
            if (err) throw err;
            console.log('Conexion establecida');
            connection.query(sql_search_2, (err, rows) => { // Query database
            if (err) throw err;
            if (rows.length > 0) { // If data is found
                var resultado = rows; // Store data in variable
                telefono = resultado[0].DU_telefono; // Get telefono from data
                direccion = resultado[0].DU_direccion; // Get direccion from data
                departamento = resultado[0].DU_departamento; // Get departamento from data
                ciudad = resultado[0].DU_ciudad; // Get ciudad from data
                estado_civil = resultado[0].DU_Estado_civil; // Get estado_civil from data
                estrato = resultado[0].DU_Estrato_economico; // Get estrato from data
                ocupacion = resultado[0].DU_Ocupacion; // Get ocupacion from data
                Regimen_Perteneciente = resultado[0].DU_Regimen_Perteneciente; // Get Regimen_Perteneciente from data
                fecha_de_nacimiento = resultado[0].fecha_de_nacimiento; // Get fecha_de_nacimiento from data
                console.log(fecha_de_nacimiento);
            peticion({
                telefono : telefono,
                direccion : direccion,
                departamento : departamento,
                ciudad : ciudad,
                estado_civil : estado_civil,
                estrato : estrato,
                ocupacion : ocupacion,
                Regimen_Perteneciente : Regimen_Perteneciente,
                fecha_de_nacimiento : fecha_de_nacimiento // Send data to promise
            });}})})});

        let data_entire = {
            numerodocumento : id,
            nombre : data1.nombre,
            apellido : data1.apellido,
            edad : data1.edad,
            genero : data1.genero,
            tipo_documento : data1.tipo_documento,
            telefono : data2.telefono,
            direccion : data2.direccion,
            departamento : data2.departamento,
            ciudad : data2.ciudad,
            estado_civil : data2.estado_civil,
            estrato : data2.estrato,
            ocupacion : data2.ocupacion,
            Regimen_Perteneciente : data2.Regimen_Perteneciente,
            fecha_de_nacimiento : data2.fecha_de_nacimiento
        }; // Create data to send
        
        console.log(data_entire);
        var data_rs = JSON.stringify(data_entire); // Convert data to string

        res.render('dashboard', {error : '', data : data_rs}); // Render dashboard page with data
    }
    else{
        res.redirect('/login'); // Redirect to login page if user is not logged in
    }
})

// Dashboard page
router.post('/', async (req, res, next)=>{

    let consulta = (columna, valor, id, tabla, key) =>{ // Function to search data
        let query = `UPDATE ${tabla} SET ${columna} = ${valor} WHERE ${key} = ${id};`;
        let sql_search = mysql.format(query);
        db.getConnection( (err, connection) => {
            if (err) throw err;
            console.log('Conexion establecida');
            connection.query(sql_search, (err, rows) => {
            if (err) throw err;
            if (rows.length > 0) {
                console.log('Datos actualizados');
            }
            })
        })
    }

    console.log('POST /dashboard');
    let data_post = req.body; // Get data from post
    let data_file = fs.readFileSync('data/datos_sesion.json'); // Get data from file
    let data_json = JSON.parse(data_file); // Convert data to json
    let id = data_json.id; // Get id from data

    let data_form = [['DU_telefono',data_post.Telefono],['DU_direccion'," ' "+ data_post.Direccion +" ' "],['DU_departamento',"'"+ data_post.Departamento+"'"],
                    ['DU_ciudad',"'"+ data_post.Ciudad+"'"],['DU_Estado_civil',"'"+ data_post.EstadoCivil+"'"],['DU_Estrato_economico',"'"+ data_post.estrato+"'"],
                    ['DU_Ocupacion',"'"+ data_post.ocupacion+"'"],['DU_Regimen_Perteneciente',"'"+ data_post.regimenPerteneciente+"'"],
                    ['DU_fecha_de_nacimiento',"'"+ data_post.fecha_nacimiento+"'"]]; // Create data to send to database (array of arrays)
    let data_form_r = [['R_tipo_de_documento','"' + data_post.tipo_documento + '"'],            // With data from file and names of columns
                    ['R_email','"' + data_post.email + '"'],['R_contraseña', '"' + data_post.password + '"']] // Same as above but in register table


    let query = `SELECT * from datos_usuario WHERE DU_num_documento = ${id} ;`; // Query to search data
    let data_db = await new Promise (peticion =>{ // Get data from database
        db.getConnection((err, conection) => { // Connect to database
            if (err) throw err;
            console.log('Conexion establecida');
            conection.query(query, (err, rows) =>{ // Query database
            if (err) throw err;
            if(rows.length > 0){
                peticion(rows) // Send data to promise
            }
        })})})
    
    console.log(data_db);
    console.log(data_post);

    data_form.map(element =>{ // For each element in data_form
        let row = element[0]; // Get row
        let value = element[1]; // Get value
        let db_value = data_db[0][row]; // Get value from database

        consulta(row, value, id, 'datos_usuario', 'DU_num_documento'); // Send data to database
    });

    data_form_r.map(element =>{
        console.log(element); // For each element in data_form
        let row = element[0]; // Get row
        let value = element[1]; // Get value
        let db_value = data_db[0][row]; // Get value from database
        if(value != ""){
            consulta(row, value, id, 'registro', 'R_num_documento'); // Send data to database
        }
    })

    next(); // Send data to next function
}, (req,res, mensaje_s)=>{
    res.redirect('/dashboard'); // Redirect to dashboard page
});


module.exports = router; // Export router