const express = require('express');

const app = express();

app.listen(4000, (req, res)=>{
    console.log('Server Running in https://localhost:4000')
});