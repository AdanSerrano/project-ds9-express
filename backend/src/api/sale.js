const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
 
router.get('/', async (req, res) => {
    try {
        const sales = await prisma.sale.findMany({
            include: {
                details: true,
                client: true  
            }
        });
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
 
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sale = await prisma.sale.findUnique({
            where: {
                id: id
            },
            include: {
                details: true,
                client: true  
            }
        });
        if (!sale) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }
        res.status(200).json(sale);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
 
router.post('/', async (req, res) => {
    const { clientId, saleDate, details } = req.body;
 
    try {
        const sale = await prisma.sale.create({
            data: {
                clientId,
                saleDate: new Date(saleDate),
                details: {
                    create: details
                }
            },
            include: {
                details: true
            }
        });
        res.status(201).json({ sale, success: 'Venta creada satisfactoriamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
 
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { clientId, saleDate } = req.body;
 
    try {
        const updatedSale = await prisma.sale.update({
            where: {
                id: id,
            },
            data: {
                clientId,
                saleDate: new Date(saleDate)
            },
            include: {
                details: true
            }
        });
 
        res.status(200).json(updatedSale);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
 
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
 
    try {
        const sale = await prisma.sale.delete({
            where: {
                id: id
            }
        });
        res.status(200).json({ success: 'Venta eliminada satisfactoriamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
 
 
router.get('/:saleId/details', async (req, res) => {
    const { saleId } = req.params;
    try {
        const details = await prisma.saleDetail.findMany({
            where: {
                saleId: saleId
            }
        });
        res.status(200).json(details);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
 
router.get('/:saleId/details/:id', async (req, res) => {
    const { saleId, id } = req.params;
    try {
        const detail = await prisma.saleDetail.findUnique({
            where: {
                id: id
            }
        });
        if (!detail) {
            return res.status(404).json({ error: 'Detalle de venta no encontrado' });
        }
        res.status(200).json(detail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
 
router.post('/:saleId/details', async (req, res) => {
    const { saleId } = req.params;
    const { product, quantity, price } = req.body;
    const total = quantity * price;
 
    try {
        const detail = await prisma.saleDetail.create({
            data: {
                saleId: saleId,
                product,
                quantity,
                price,
                total
            }
        });
        res.status(201).json({ detail, success: 'Detalle de venta creado satisfactoriamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
 
router.put('/:saleId/details/:id', async (req, res) => {
    const { id } = req.params;
    const { product, quantity, price } = req.body;
    const total = quantity * price;
 
    try {
        const updatedDetail = await prisma.saleDetail.update({
            where: {
                id: id,
            },
            data: {
                product,
                quantity,
                price,
                total
            }
        });
 
        res.status(200).json(updatedDetail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
 
router.delete('/:saleId/details/:id', async (req, res) => {
    const { id } = req.params;
 
    try {
        const detail = await prisma.saleDetail.delete({
            where: {
                id: id
            }
        });
        res.status(200).json({ success: 'Detalle de venta eliminado satisfactoriamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
 
module.exports = router;