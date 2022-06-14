var express = require('express');
var router = express.Router();
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

router.get('/', (req, res, next) => {
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
        }});
    console.log('GET /login');
    next();
}, (req,res) => {
    res.render('login', {error : '', mensaje: ''});
})

router.post('/', (req, res, next) => {
    console.log('POST /login');
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
    const id_usuario = parseInt(req.body.documento_id);
    const password = req.body.Contraseña;

    let sql_search = `SELECT * FROM registro WHERE R_num_documento = ${id_usuario};`;
    
    let query = mysql.format(sql_search);
    console.log(query);
    db.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Conexion establecida');
    connection.query(query, (err, rows) => {
        if (err) throw err;
        if (rows.length > 0) {
            var resultado = rows;
            console.log(resultado);
            if(resultado[0].R_contraseña == password){

                let data_temp = {
                'id' : id_usuario,
                'estado' : 'activo'
                }
                let data = JSON.stringify(data_temp);
                fs.writeFileSync('data/datos_sesion.json', data, (error)=>{
                if(error){
                    console.log(error);
                }
                else{
                    console.log('Archivo creado');
                }
                });

                res.redirect('/dashboard/');
                console.log('Contraseña correcta, redireccionando a la pagina principal');
            }
            else{
                console.log('Contraseña incorrecta');
                next( {error : 'Contraseña incorrecta', mensaje: ''});
            }
        }
        else {
            res.render('login', {error : 'Usuario no registrado', mensaje: ''});
            console.log('Usuario no registrado');
        }
    })
    })
}, (req,res, mensaje_s) => {
    res.render('login', mensaje_s);
})

module.exports = router;