//llamando libraries
const express = require('express');

const app = express();
const port = 3000 || process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static( __dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index');
});

// LOGIN

app.use('/login', require('./routers/login'));

// REGISTER

app.use('/register', require('./routers/register'));

// DASHBOARD

app.use('/dashboard', require('./routers/dashboard'));

// 404
app.use((req, res, next) => {
  res.status(404).render("404", {url : req.url});
});

// SET UP SERVER

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})