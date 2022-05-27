const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000 || process.env.PORT;

const db =  mysql.createConnection({
  localAddress: 'localhost',
  user: 'root',
  password: 'root',
  database: 'registro_BD',
  port : 3306
});

db.connect((err, connection) => {
  if (err) throw err;
  console.log('Base de datos conectada');
})

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set()

app.use(express.static( __dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index');
});

// LOGIN

app.get('/login', (req, res) => {
  res.render('login', {error : '', mensaje: ''});
})

app.post('/login', (req, res) => {
})

// REGISTRO

app.get('/registro', (req, res) => {
  res.render('registro', {error : '', mensaje: ''});
}) 

app.post('/registro', (req, res) => {
  const tipo_usuario = req.body.usuario;
  const tipo_documento = req.body.Tipo_documento;
  const documento = req.body.id;
  const nombre = req.body.nombre;
  const apellidos = req.body.Apellidos;
  const edad = req.body.edad;
  const genero = req.body.Genero;
  const email = req.body.email;
  const contraseña = req.body.password;

  db.connect(async (err, connection) => {
    if (err) throw err;

    const sql_search = "SELECT * FROM registro WHERE num_documento = ?"
    const search_sql = mysql.format(sql_search, [documento]);
    
    const sql_insert = "INSERT INTO registro(num_documento, nombres, apellidos, edad, genero, email contraseña, tipo_de_usuario, tipo_de_documento) VALUES (?,?,?,?,?,?,?,?)";
    const query_sql = mysql.format(sql_insert, [documento, nombre, apellidos, edad, genero, email, contraseña, tipo_usuario, tipo_documento]);

    await connection.query(search_sql, (err, result) => {
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
  res.status(404).render("404", { titulo: "Página 404" });
});

// SET UP SERVER

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})