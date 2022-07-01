//  Calling libraries
const express = require('express'); // Express web server framework
const bodyParser = require('body-parser'); // Parses the body of the request

// // Starting express app

const app = express();
const port = 3000 || process.env.PORT;

// Middleware

app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'ejs'); // set up ejs for templating
app.set('views', __dirname + '/views'); // set up views directory

app.use(express.static( __dirname + '/public')); // set up public directory for css and js files

app.get('/', (req, res) => {
  res.render('index');
}); // render the index.ejs file

// LOGIN ROUTE

app.use('/login', require('./routers/login')); // use the login router

// REGISTER ROUTE

app.use('/register', require('./routers/register')); // register route

// DASHBOARD ROUTE

app.use('/dashboard', require('./routers/dashboard')); // import the router for the dashboard

// Recovery ROUTE

app.use('/recovery', require('./routers/recovery')); // import the router for the recovery

// 404 ROUTE
app.use((req, res, next) => {
  res.status(404).render("404", {url : req.url}); // render the 404.ejs file if the url is not found
});

// SET UP SERVER

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})