require('dotenv').config(); // load envirement variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const app = express();
const PORT = process.env.PORT || 3000 ;
const itemRoutes = require('./routes/itemROutes');
const userRoutes = require('./routes/userRoutes');

// Middleware to parse JSON bodies 
app.use(express.json());
app.use(cors());

//connect to MongoDb
mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("connected to mongodb"))
    .catch((err)=>console.error("Some error occured",err));

//basic route
app.get('/', (req, res)=>{
    res.send("This is entry route");
})

app.use('/item', itemRoutes);
app.use('/user', userRoutes);

app.listen(PORT, ()=>{
    console.log("Server is running on port: ",PORT);
});