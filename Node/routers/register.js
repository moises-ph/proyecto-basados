const express = require('express');
const router = express.Router();
const fs = require('fs');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));

const db =  mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'Mphr_2015',
    database: 'registro_BD',
    port : 3306
});

db.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Base de datos conectada');
})


router.get('/', (req, res) => {
    let data_null_tmp ={
    'id': 0,
    'estado': 'inactivo'
    }
    let data_null = JSON.stringify(data_null_tmp);
    fs.writeFileSync('data/datos_sesion.json', data_null, (error)=>{
            if(error){
                console.log(error);
            }
            else{
                console.log('Archivo editado a 0');
            }
            });
    res.render('registro', {error : '', mensaje: ''});
}) 

router.post('/', (req, res) => {
    let data_null_tmp ={
    'id': 0,
    'estado': 'inactivo'
    }
    let data_null = JSON.stringify(data_null_tmp);
    fs.writeFileSync('data/datos_sesion.json', data_null, (error)=>{
            if(error){
                console.log(error);
            }
            else{
                console.log('Archivo editado a 0');
            }
            });
    console.log(req);
    const tipo_usuario = req.body.usuario;
    const tipo_documento = req.body.Tipo_documento;
    const documento = req.body.id;
    const nombre = req.body.nombre;
    const apellidos = req.body.Apellidos;
    const edad = req.body.edad;
    const genero = req.body.Genero;
    const email = req.body.email;
    const contraseña = req.body.password;

    db.getConnection( (err, connection) => {
    if (err) throw err;
    console.log('Conexion establecida');

      const sql_search = "SELECT * FROM registro WHERE R_num_documento = ?;"
    const search_sql = mysql.format(sql_search, [documento]);
    
    const sql_insert = "INSERT INTO registro(R_num_documento,R_nombres, R_apellidos, R_edad, R_genero, R_email, R_contraseña, R_tipo_de_usuario, R_tipo_de_documento) VALUES (?,?,?,?,?,?,?,?,?);"
    const query_sql = mysql.format(sql_insert, [documento, nombre, apellidos, edad, genero, email, contraseña, tipo_usuario, tipo_documento]);

    connection.query( search_sql,  (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
        console.log('Usuario ya registrado');
        res.render('registro', {error : 'Usuario ya registrado', mensaje: ''});
        }
        else {
        connection.query(query_sql, (err, result) => {
            if (err) throw err;
            console.log('Usuario registrado');
            res.render('registro', {error : '', mensaje: 'Usuario registrado'});
        })

        let sql_datos_basicos = 'INSERT INTO datos_usuario(DU_num_documento, DU_telefono, DU_direccion, DU_departamento, DU_ciudad, DU_Estado_civil, DU_Estrato_economico, DU_Ocupacion, DU_Regimen_Perteneciente, DU_fecha_de_nacimiento) values (?,?,?,?,?,?,?,?,?,?);';
        let query_datos_basicos = mysql.format(sql_datos_basicos, [documento, 0, 'none', 'none', 'none', 'none', 0, 'none', 'none', '2000-01-01']);
        connection.query(query_datos_basicos, (err, result) => {
            if (err) throw err;
            console.log('Datos basicos registrados');
        })
        }
    })
    })
})


module.exports = router;