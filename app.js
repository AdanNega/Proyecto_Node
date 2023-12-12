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

app.get('/', (req, res)=>{
    res.send("Holiiii");
});

app.listen(4000, (req, res)=>{
    console.log('Server Running in https://localhost:4000')
});