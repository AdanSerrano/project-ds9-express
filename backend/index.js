const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { ObjectId } = require('mongodb');
const bcryptjs = require('bcryptjs');
const { Role } = require('@prisma/client')
const prisma = new PrismaClient();
const app = express();

require('dotenv').config();

const clientRouter = require('./src/api/client');
const loginRouter = require('./src/api/login');
const salesRouter = require('./src/api/sale');
const usersRouter = require('./src/api/users');

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/api/clients', clientRouter);
app.use('/api/login', loginRouter);
app.use('/api/sales', salesRouter);
app.use('/api/users', usersRouter);

// start server 
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});