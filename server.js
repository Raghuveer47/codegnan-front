const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userAuth = require('./routers/userAuth');
const post = require('./routers/post');
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://codegnan:codegnan@cluster0.c971alh.mongodb.net/?retryWrites=true&w=majority').then(() => console.log("Db connected succesfully"));

app.use('/api/auth', userAuth);
app.use('/api/post', post);

app.listen(5000, () => console.log("server is running"));