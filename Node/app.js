const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const redirect = require('express-redirect');

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

  db.getConnection(async (err, connection) => {
    if (err) throw err;

    const sql_search = "SELECT * FROM registro WHERE num_documento = ?;"
    const search_sql = mysql.format(sql_search, [documento]);
    
    const sql_insert = "INSERT INTO registro(num_documento, nombres, apellidos, edad, genero, email, contraseña, tipo_de_usuario, tipo_de_documento) VALUES (?,?,?,?,?,?,?,?,?);"
    const query_sql = mysql.format(sql_insert, [documento, nombre, apellidos, edad, genero, email, contraseña, tipo_usuario, tipo_documento]);

    await connection.query( search_sql,async  (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        console.log('Usuario ya registrado');
        res.render('registro', {error : 'Usuario ya registrado', mensaje: ''});
      }
      else {
        await connection.query(query_sql, (err, result) => {
          if (err) throw err;
          console.log('Usuario registrado');
          res.render('registro', {error : '', mensaje: 'Usuario registrado'});
        })

        let sql_datos_basicos = 'INSERT INTO datos_usuario(num_documento, telefono, direccion, departamento, ciudad, Estado_civil, Estrato_economico, Ocupacion, Regimen_Perteneciente, fecha_de_nacimiento) values (?,?,?,?,?,?,?,?,?,?);';
        let query_datos_basicos = mysql.format(sql_datos_basicos, [documento, 0, '', '', '', '', 0, '', '', '2000-01-01']);
        await connection.query(query_datos_basicos, (err, result) => {
          if (err) throw err;
          console.log('Datos basicos registrados');
        })
        
        let sql_historia = "INSERT INTO historia_clinica(num_documento, Tiempo_historial, evento_historial, descripcion_historial) VALUES (?,?,?,?);"
        let query_historia = mysql.format(sql_historia, [documento, '', '', '']);
        await connection.query(query_historia, (err, result) => {
          if (err) throw err;
          console.log('Historia clinica registrada');
        })
      }
    })
  })
})

// DASHBOARD

app.get('/dashboard', (req, res) => {
  res.render('dashboard', {error : ''});
})

// 404
app.use((req, res, next) => {
  res.status(404).render("404", {url : req.url});
});

// SET UP SERVER

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})