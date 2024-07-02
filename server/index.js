const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const userRoute=require('./Routes/userRoute');
const chatRoute=require('./Routes/chatRoute');
const messageRoute=require('./Routes/messageRoute');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/users',userRoute);
app.use('/api/chats',chatRoute);
app.use('/api/messages',messageRoute);
app.get("/",(req,res)=>{
    res.send({Welcome:"Hello World"});
})

const PORT = process.env.PORT || 5000; 
const host = process.env.HOST || '0.0.0.0';
const uri = process.env.MONGODB_URI || "mongodb+srv://sonaiclaymind:sonaiclaymind@cluster0.xcoluhw.mongodb.net/chatApp?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1); 
    });

const server = app.listen(PORT,host, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EACCES') {
        console.error(`Port ${PORT} requires elevated privileges`);
    } else if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
    } else {
        console.error('Error starting server:', err);
    }
    process.exit(1);
});
