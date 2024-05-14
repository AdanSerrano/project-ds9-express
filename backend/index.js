const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { ObjectId } = require('mongodb');
const bcryptjs = require('bcryptjs');
const { Role } = require('@prisma/client')
const prisma = new PrismaClient();
const app = express();


app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//test api 
app.get('/test', async (req, res) => {
    try {
        res.status(200).json({ message: 'Hello World' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//get all users
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//get user by id
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: String(id)
            }
        });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//create user
app.post('/users', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcryptjs.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                role: Role.USER,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/users/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: String(id),
            },
            data: {
                name: 'Adan Doe',
                email: 'adanu0adf503@gmail.com',
                password: 'password',
                role: Role.ADMIN,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//delete user
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.delete({
            where: {
                id: String(id)
            }
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})

// start server 
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});