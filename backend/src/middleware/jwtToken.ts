import { Request, Response, NextFunction } from 'express';
import VerificationService from '../model/services/verification.services';
import { error } from 'console';

const verifyTokenMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    // Extract cookies from request
    const service = new VerificationService();

    const tokenInfo = request.header('Authorization');

    if (!tokenInfo) {
        response.status(401).json({
            message: 'No está autorizado',
            errorMessages: true,
        });
        return;
    }

    const token = tokenInfo.split(' ')[1];

    if (!token) {
        response.status(401).json({
            message: 'No está autorizado 99',
            errorMessages: true,
        });
        return;
    }

    try {
        //const user = service.verifyToken(token);
        next();
    } catch (error) {
        response.status(401).json({
            message: 'No está autorizado98',
            errorMessages: true,
        });
        return;
    }

};

export default verifyTokenMiddleware;
