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

// Rutas

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
    
    connection.query('SELECT * FROM usuario WHERE nom_usu="'+nom_usu+'"', async(err,resu)=>{

        if(err){
            console.log(err);
        }else{
            //console.log(resu);
            //console.log(resu.length);
            if(resu.length != 0){
                // Código para enviar alertas con sweetalert2 (No funciona, creo)
                res.render('login',{
                    alert: true,
                    alertTitle: "Error al Registrar",
                    alertMessage: "Usuario ya existente",
                    alertIcon: 'error',
                    showConfirmButton: false,
                    timer: 2000,
                    ruta:'login'
                });
            }else{
                connection.query('INSERT INTO usuario SET ?', {nom_usu:nom_usu, cor_usu:cor_usu, pre_usu:pre_usu, res_usu:res_usu, rol_usu:'Admin', pas_usu:passwordHaash}, async(error, results)=>{
                    if(error){
                        console.log(error);
                    }else{
            
                        // Código para enviar alertas con sweetalert2 (No funciona, creo)
                        res.render('login',{
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
            }

        }

    });

});

// Autenticacion de usuarios

app.post('/iniciar', async (req, res)=>{
    
    const nom_usu = req.body.usr;
    const pas_usu = req.body.pass;

    //console.log(req.body);

    let passwordHaash = await bcryptjs.hash(pas_usu, 8);

    if(nom_usu && pas_usu){
        connection.query('SELECT * FROM usuario WHERE nom_usu = "'+nom_usu+'"', async(error, results) =>{
            //console.log(results);
            if(results.length == 0 || !(await bcryptjs.compare(pas_usu, results[0].pas_usu))){
                res.render('login',{
                    alert: true,
                    alertTitle: "Login Error",
                    alertMessage: "Usuario y/o Password incorrectos",
                    alertIcon: 'error',
                    showConfirmButton: false,
                    timer: 2000,
                    ruta:'login'
                });
            }else{
                req.session.loggedin = true;
                req.session.name = results[0].nom_usu;
                res.render('login',{
                    alert: true,
                    alertTitle: "Welcome",
                    alertMessage: "Inicio de Sesión Exitoso!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 2000,
                    ruta:''
                });
            }
        })
    }else{
        res.render('login',{
            alert: true,
            alertTitle: "Alerta",
            alertMessage: "Favor de rellenar los campos solicitados!",
            alertIcon: 'warning',
            showConfirmButton: false,
            timer: 2000,
            ruta:'login'
        });
    }

});

// Autenticación de sesión

app.get('/', (req, res)=>{
    if(req.session.loggedin){
        res.render('index', {
            login: true,
            name: req.session.name
        });
    }else{
        res.render('index', {
            login: false,
            name: 'Debe iniciar sesión'
        });
    }
})

// Logout

app.get('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    });
});

app.listen(4000, (req, res)=>{
    console.log('Server Running in https://localhost:4000')
});