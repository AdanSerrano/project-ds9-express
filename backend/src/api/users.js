const express = require("express");
const bcryptjs = require("bcryptjs");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { Role } = require('@prisma/client')

//test api 
router.get('/test', async (req, res) => {
    try {
        res.status(200).json({ message: 'Hello World' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//get all users
router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                role: Role.USER
            }
        });
        // console.log(users)
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//get user by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//create user
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Usuario existe' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: Role.USER
            }
        });
        res.status(201).json({ user, success: 'Usuario creado satisfactoriamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: String(id),
            }
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//delete user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.delete({
            where: {
                id: String(id)
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no existe' });
        }
        res.status(200).json({ success: 'Usuario eliminando satifactoriamente' });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

module.exports = router;