const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql2');
const ejs = require('ejs');
const pdf = require('pdfkit');
const session = require('express-session');
const flash = require('express-flash');
const myConnection = require('express-myconnection');

//const passport = require('passport'), LocalStategy = require('passport-local').Strategy;

const app = express();

//importing routes
const costumerRoutes = require('./routes/costumers');


// settings express
let port = 3000;
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//app.urlencode();



//middlewares
app.use(express.json());
app.use(session({
  secret: 'diaMujer',
  resave: false,
  saveUninitialized: false
}));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(myConnection(mysql, {
  host: 'localhost',
  user: 'k3nsh1n',
  password: 'k0rn82...',
  port: 3306,
  database: 'diaMujer'
}, 'single'));


//routes
app.use('/', costumerRoutes);

//static files
app.use(express.static('public'));


app.listen(app.get('port'), () => {
  console.log('Server on port 3000');
});
