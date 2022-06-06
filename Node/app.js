const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fs = require('fs');
const { errorMonitor } = require('events');
const { log } = require('console');
const cors = require('cors');

const app = express();
const port = 3000 || process.env.PORT;

const db =  mysql.createPool({
  connectionLimit: 100,
  host: 'localhost',
  user: 'root',
  password: 'mphr2015',
  database: 'registro_BD',
  port : 3306
});

db.getConnection((err, connection) => {
  if (err) throw err;
  console.log('Base de datos conectada');
})

const corsOptions= {
  origin: 'localhost:3000',
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOptions));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set()

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static( __dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index');
});

// LOGIN

app.get('/login', (req, res) => {
  console.log('GET /login');
  res.render('login', {error : '', mensaje: ''});
})

app.post('/login', (req, res) => {
  console.log('POST /login');
  const id_usuario = parseInt(req.body.documento_id);
  const password = req.body.Contraseña;

  let sql_search = `SELECT * FROM registro WHERE num_documento = ${id_usuario};`;
  
  let query = mysql.format(sql_search);
  console.log(query);
  db.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(query, (err, rows) => {
      if (err) throw err;
      if (rows.length > 0) {
        var resultado = rows;
        console.log(resultado);
        if(resultado[0].contraseña == password){

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

          res.redirect('/dashboard');
          console.log('Contraseña correcta, redireccionando a la pagina principal');
        }
        else{
          res.render('login', {error : 'Contraseña incorrecta', mensaje: ''});
          console.log('Contraseña incorrecta');
        }
      }
      else {
        res.render('login', {error : 'Usuario no registrado', mensaje: ''});
        console.log('Usuario no registrado');
      }
    })
  })
})

// REGISTRO

app.get('/registro', (req, res) => {
  res.render('registro', {error : '', mensaje: ''});
}) 

app.post('/registro', (req, res) => {
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

    const sql_search = "SELECT * FROM registro WHERE num_documento = ?;"
    const search_sql = mysql.format(sql_search, [documento]);
    
    const sql_insert = "INSERT INTO registro(num_documento, nombres, apellidos, edad, genero, email, contraseña, tipo_de_usuario, tipo_de_documento) VALUES (?,?,?,?,?,?,?,?,?);"
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

        let sql_datos_basicos = 'INSERT INTO datos_usuario(num_documento, telefono, direccion, departamento, ciudad, Estado_civil, Estrato_economico, Ocupacion, Regimen_Perteneciente, fecha_de_nacimiento) values (?,?,?,?,?,?,?,?,?,?);';
        let query_datos_basicos = mysql.format(sql_datos_basicos, [documento, 0, 'none', 'none', 'none', 'none', 0, 'none', 'none', '2000-01-01']);
        connection.query(query_datos_basicos, (err, result) => {
          if (err) throw err;
          console.log('Datos basicos registrados');
        })
      }
    })
  })
})

// DASHBOARD

app.get('/dashboard', async (req, res) => {
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
    let query = "SELECT nombres, apellidos, edad, genero, tipo_de_documento FROM registro WHERE num_documento = ?;"
    let sql_search = mysql.format(query, [id]);

    let query_2 = 'SELECT telefono, direccion, departamento, ciudad, Estado_civil, Estrato_economico,Ocupacion, Regimen_Perteneciente, date_format(fecha_de_nacimiento, "%Y-%m-%d") as fecha_de_nacimiento from datos_usuario WHERE num_documento = ?;';
    let sql_search_2 = mysql.format(query_2, [id]);

    let data1 = await new Promise (peticion => {db.getConnection( (err, connection) => {
      if (err) throw err;
      connection.query(sql_search, (err, rows) => {
        if (err) throw err;
        if (rows.length > 0) {
          var resultado = rows;
          nombre = resultado[0].nombres;
          apellido = resultado[0].apellidos;
          edad = resultado[0].edad;
          genero = resultado[0].genero;
          peticion({
            nombre : nombre,
            apellido : apellido,
            edad : edad,
            genero : genero,
            tipo_documento : resultado[0].tipo_de_documento
          });
        }
      })
    })});

    let data2 = await new Promise (peticion => {db.getConnection( (err, connection) => {
      if (err) throw err;
      connection.query(sql_search_2, (err, rows) => {
        if (err) throw err;
        if (rows.length > 0) {
          var resultado = rows;
          telefono = resultado[0].telefono;
          direccion = resultado[0].direccion;
          departamento = resultado[0].departamento;
          ciudad = resultado[0].ciudad;
          estado_civil = resultado[0].Estado_civil;
          estrato = resultado[0].Estrato_economico;
          ocupacion = resultado[0].Ocupacion;
          Regimen_Perteneciente = resultado[0].Regimen_Perteneciente;
          fecha_de_nacimiento = resultado[0].fecha_de_nacimiento;
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
    let data_rs = JSON.stringify(data_entire);

    res.render('dashboard', {error : '', data : data_rs});
  }
  else{
    res.render('login', {error : 'Inicie sesión para ingresar al dashboard', mensaje: ''});
  }
})

app.post('/dashboard', (req, res)=>{
  
});

app.get('/dashboard/data', (req, res) => {
  let data = fs.readFileSync('data/datos_dash.json');
  let data_json = JSON.parse(data);
  console.log('Data request');  
  res.send(data_json);
});

// 404
app.use((req, res, next) => {
  res.status(404).render("404", {url : req.url});
});

// SET UP SERVER

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})