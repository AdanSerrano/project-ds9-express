import express, { Request, Response, NextFunction } from 'express';
import verifyTokenMiddleware from '../../middleware/jwtToken';
import DatabaseService from '../../model/services/database.services';
import SalesModel from '../../model/sales.model';
import SalesController from '../../controller/sales.controller';

export const SalesRouter = (expressInstance: express.Router): express.Router => {
    expressInstance.get('/', async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const service = new SalesModel(DatabaseService.getInstance());
            const controller = new SalesController(service);
            const sales = await controller.findAllSales();
            res.status(201).json(sales);
        } catch (error) {
            next(error);
        }
    });

    expressInstance.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const service = new SalesModel(DatabaseService.getInstance());
            const controller = new SalesController(service);
            const sale = await controller.getOneSales(id);
            res.status(201).json(sale);
        } catch (error) {
            next(error);
        }
    });

    expressInstance.post('/', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const service = new SalesModel(DatabaseService.getInstance());
            const controller = new SalesController(service);
            const sale = await controller.createSales(req.body);
            res.status(201).json(sale);
        } catch (error) {
            next(error);
        }
    });

    return expressInstance;
};
