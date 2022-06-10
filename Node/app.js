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
  password: '',
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
  console.log('GET /login');
  res.render('login', {error : '', mensaje: ''});
})

app.post('/login', (req, res) => {
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

app.post('/registro', (req, res) => {
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
          fecha_de_nacimiento = resultado[0].DU_fecha_de_nacimiento;
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
    res.render('login', {error : 'Inicie sesión para ingresar al dashboard', mensaje: ''});
  }
})

app.post('/dashboard', async (req, res)=>{

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

  let data_form = [['DU_telefono',data_post.Telefono],['DU_direccion',data_post.direccion],['DU_departamento', data_post.departamento],
                  ['DU_ciudad', data_post.ciudad],['DU_Estado_civil', data_post.estado_civil],['DU_Estrato_economico', data_post.estrato],
                  ['DU_Ocupacion', data_post.ocupacion],['DU_Regimen_Perteneciente', data_post.Regimen_Perteneciente],
                  ['DU_fecha_de_nacimiento', data_post.fecha_nacimiento]];
  let data_form_r = [['R_tipo_de_documento', data_json.tipo_documento],
                  ['R_email', data_json.email],['R_contraseña', data_json.password[0]]];


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

    if(value !== db_value ){
      consulta(row, value, id, 'datos_usuario', 'DU_num_documento');
      console.log('Datos actualizados en datos_usuario');
    }
  })

  data_form_r.map(element =>{
    let row = element[0];
    let value = element[1];
    let db_value = data_db[0][row];

    console.log(row, ' ', db_value);

    if(value !== db_value ){
      /*consulta(row, value, id, 'registro', 'R_num_documento');
      console.log('Datos actualizados en datos_registro');*/
    }
  })


  res.redirect('/dashboard');
});

// 404
app.use((req, res, next) => {
  res.status(404).render("404", {url : req.url});
});

// SET UP SERVER

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})