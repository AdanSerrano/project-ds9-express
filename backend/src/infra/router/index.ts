import { Router } from 'express';
import AuthRouter from './auth.router';
import { ClientRouter } from './client.router';

export const app_router = (app: Router) => [
    {
        path: '/api/auth',
        router: AuthRouter(app),
    },
    {
        path: '/api/clients',
        router: ClientRouter(app),
    },
    {
        path: '/api/users',
        router: AuthRouter(app),
    },
];
