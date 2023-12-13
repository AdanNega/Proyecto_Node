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
app.use('/scripts', express.static('scripts'));
app.use('/scripts', express.static(__dirname + '/scripts'));

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
const connection = require('./database/db');

app.get('/', (req, res)=>{
    res.render('index', {msg: "Mensaje de prueba"});
});

app.get('/login', (req, res)=>{
    res.render('login');
});

// Registro de Usuarios

app.post('/register', async (req, res)=>{
    
    // Se guardan los datos del formulario en una variable cada uno
    const nom_usu=req.body.user;
    const cor_usu=req.body.correo;
    const pas_usu=req.body.password;
    const pre_usu=req.body.pregunta;
    const res_usu=req.body.respuesta;

    // Encriptamos la contraseña
    let passwordHaash = await bcryptjs.hash(pas_usu, 8);

    connection.query('INSERT INTO usuario SET ?', {nom_usu:nom_usu, cor_usu:cor_usu, pre_usu:pre_usu, res_usu:res_usu, rol_usu:'Admin', pas_usu:passwordHaash}, async(error, results)=>{
        if(error){
            console.log(error);
        }else{

            // Código para enviar alertas con sweetalert2 (No funciona, creo)
            res.render('',{
                alert: true,
                alertTitle: "Registration",
                alertMessage: "Registro exitoso!!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 2000,
                ruta:''
            });
        }
    });

});

// Autenticacion de usuarios

app.post('/iniciar', async (req, res)=>{
    
    const nom_usu = req.body.user;
    const pas_usu = req.body.password;

    let passwordHaash = await bcryptjs.hash(pas_usu,8);
    
});

app.listen(4000, (req, res)=>{
    console.log('Server Running in https://localhost:4000')
});