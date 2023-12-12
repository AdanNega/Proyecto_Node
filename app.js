// Invocación de express
const express = require('express');
const app = express();

// Manejo de datos de formulario con urlencoded
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Invocacion dotenv
const dotenv = require('dotenv');
dotenv.config({path: './env/.env'});

// Directorio Public
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

// Motor de plantillas a utilizar
app.set('view engine', 'ejs');

// Invocacion Bcryptjs para cifrado de contraseñas
const bcryptjs = require('bcryptjs');

// Variable de sesiones
const session = require('express-session');
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true
}));

// Invocación al módulo de conexión de la BD
const conecction = require('./database/db');

app.get('/', (req, res)=>{
    res.send("Holiiii");
});

app.listen(4000, (req, res)=>{
    console.log('Server Running in https://localhost:4000')
});