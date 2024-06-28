import { Request, Response, NextFunction } from 'express';
import VerificationService from '../model/services/verification.services';

const verifyTokenMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    // Extract cookies from request
    const { cookies } = request;

    // Extract JWT from cookies
    const token = cookies.jwt;

    // If no token, return 401
    if (!token) {
        response.status(401).json('No está autorizado');
        return;
    }

    const service = new VerificationService();

    try {
        const user = service.verifyToken(token);

        if (!user) {
            response.status(403).json('No está autorizado');
            return;
        }

        request.body.user = user;
        next();
    } catch (error) {
        response.status(403).json('No está autorizado');
        return; // Ensure the function returns here to avoid type error
    }
};

export default verifyTokenMiddleware;
