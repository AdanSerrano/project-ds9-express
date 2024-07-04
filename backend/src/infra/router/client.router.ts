import express, { Request, Response, NextFunction } from 'express';
import verifyTokenMiddleware from '../../middleware/jwtToken';
import DatabaseService from '../../model/services/database.services';
import ClientModel from '../../model/client.model';
import ClientController from '../../controller/client.controller';

export const ClientRouter = (expressInstance: express.Router): express.Router => {
    expressInstance.get('/', verifyTokenMiddleware, async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const service = new ClientModel(DatabaseService.getInstance());
            const controller = new ClientController(service);
            const clients = await controller.getAll();
            res.status(200).json(clients);
        } catch (error) {
            next(error); // Pass the error to the error-handling middleware
        }
    });

    expressInstance.get('/:id', verifyTokenMiddleware, async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const service = new ClientModel(DatabaseService.getInstance());
            const controller = new ClientController(service);
            const client = await controller.getOne(id);
            res.status(200).json(client);
        } catch (error) {
            next(error); // Pass the error to the error-handling middleware
        }
    });

    return expressInstance;
};
