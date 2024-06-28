import { Router } from 'express';
import verifyTokenMiddleware from '../../middleware/jwtToken';

const AuthRouter = (app: Router): Router => {
    const router = Router();

    router.get('/', (req, res) => {
        res.send('Auth route');
    });

    return router;
};

export default AuthRouter;
