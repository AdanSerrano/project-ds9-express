const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//get all clients
router.get('/', async (req, res) => {
    try {
        const clients = await prisma.client.findMany();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//get client by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const client = await prisma.client.findUnique({
            where: {
                id: Number(id)
            }
        });
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//create client
router.post('/', async (req, res) => {
    const { name, lastname, phoneNumber } = req.body;

    try {
        const client = await prisma.client.create({
            data: {
                name,
                lastname,
                phoneNumber
            }
        });
        res.status(201).json({ client, success: 'Cliente creado satisfactoriamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//update client
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, lastname, phoneNumber } = req.body;

    try {
        const updatedClient = await prisma.client.update({
            where: {
                id: Number(id),
            },
            data: {
                name,
                lastname,
                phoneNumber
            }
        });

        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//delete client
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const client = await prisma.client.delete({
            where: {
                id: Number(id)
            }
        });
        res.status(200).json({ success: 'Cliente eliminado satisfactoriamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
