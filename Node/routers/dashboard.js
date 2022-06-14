const express = require('express');
const router = express.Router();
const fs = require('fs');
const mysql = require('mysql');
const bodyParser = require('body-parser');


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

router.get('/', async (req, res) => {
    console.log('GET /dashboard');
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

    let data = fs.readFileSync('data/datos_sesion.json');
    let data_json = JSON.parse(data);
    console.log(data_json);
    let id = data_json.id;
    let estado = data_json.estado;
    if(estado === 'activo'){
        let query = "SELECT R_nombres, R_apellidos, R_edad, R_genero, R_tipo_de_documento FROM registro WHERE R_num_documento = ?;"
        let sql_search = mysql.format(query, [id]);

        let query_2 = 'SELECT DU_telefono, DU_direccion, DU_departamento, DU_ciudad, DU_Estado_civil, DU_Estrato_economico,DU_Ocupacion, DU_Regimen_Perteneciente, date_format(DU_fecha_de_nacimiento, "%Y-%m-%d") as fecha_de_nacimiento from datos_usuario WHERE DU_num_documento = ?;';
        let sql_search_2 = mysql.format(query_2, [id]);

        let data1 = await new Promise (peticion => {db.getConnection( (err, connection) => {
            if (err) throw err;
            console.log('Conexion establecida');
            connection.query(sql_search, (err, rows) => {
            if (err) throw err;
            if (rows.length > 0) {
                var resultado = rows;
                nombre = resultado[0].R_nombres;
                apellido = resultado[0].R_apellidos;
                edad = resultado[0].R_edad;
                genero = resultado[0].R_genero;
            peticion({
                nombre : nombre,
                apellido : apellido,
                edad : edad,
                genero : genero,
                tipo_documento : resultado[0].R_tipo_de_documento
                });
            }
            })
        })});

        let data2 = await new Promise (peticion => {db.getConnection( (err, connection) => {
            if (err) throw err;
            console.log('Conexion establecida');
            connection.query(sql_search_2, (err, rows) => {
            if (err) throw err;
            if (rows.length > 0) {
                var resultado = rows;
                telefono = resultado[0].DU_telefono;
                direccion = resultado[0].DU_direccion;
                departamento = resultado[0].DU_departamento;
                ciudad = resultado[0].DU_ciudad;
                estado_civil = resultado[0].DU_Estado_civil;
                estrato = resultado[0].DU_Estrato_economico;
                ocupacion = resultado[0].DU_Ocupacion;
                Regimen_Perteneciente = resultado[0].DU_Regimen_Perteneciente;
                fecha_de_nacimiento = resultado[0].fecha_de_nacimiento;
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
                fecha_de_nacimiento : fecha_de_nacimiento
                });
            }
            })
        })});

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
        };
        
        console.log(data_entire);
        var data_rs = JSON.stringify(data_entire);

        res.render('dashboard', {error : '', data : data_rs});
    }
    else{
        res.redirect('/login');
    }
})

router.post('/', async (req, res, next)=>{

    let consulta = (columna, valor, id, tabla, key) =>{
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
    let data_post = req.body;
    let data_file = fs.readFileSync('data/datos_sesion.json');
    let data_json = JSON.parse(data_file);
    let id = data_json.id;

    let data_form = [['DU_telefono',data_post.Telefono],['DU_direccion'," ' "+ data_post.direccion +" ' "],['DU_departamento',"'"+ data_post.Departamento+"'"],
                    ['DU_ciudad',"'"+ data_post.Ciudad+"'"],['DU_Estado_civil',"'"+ data_post.estado_civil+"'"],['DU_Estrato_economico',"'"+ data_post.estrato+"'"],
                    ['DU_Ocupacion',"'"+ data_post.ocupacion+"'"],['DU_Regimen_Perteneciente',"'"+ data_post.Regimen_Perteneciente+"'"],
                    ['DU_fecha_de_nacimiento',"'"+ data_post.fecha_nacimiento+"'"]];
    let data_form_r = [['R_tipo_de_documento', data_json.tipo_documento],
                    ['R_email', data_json.email],['R_contraseña', data_json.password]]


    let query = `SELECT * from datos_usuario WHERE DU_num_documento = ${id} ;`;
    let data_db = await new Promise (peticion =>{
        db.getConnection((err, conection) => {
            if (err) throw err;
            console.log('Conexion establecida');
            conection.query(query, (err, rows) =>{
            if (err) throw err;
            if(rows.length > 0){
                peticion(rows)
            }
        })})})
    
    console.log(data_db);
    console.log(data_post);

    data_form.map(element =>{
    let row = element[0];
    let value = element[1];
    let db_value = data_db[0][row];

    consulta(row, value, id, 'datos_usuario', 'DU_num_documento');

    })

    next({error : ''});
}, (req,res, mensaje_s)=>{
    res.redirect('/dashboard', {error : mensaje_s.error});
});


module.exports = router;