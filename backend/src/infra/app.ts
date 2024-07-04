import express from 'express';
import cookieParser from 'cookie-parser';
import { app_router } from './router';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

const router = express.Router();
const routes = app_router(router);

routes.forEach(({ path, router }) => {
    app.use(path, router);
});

app.use('/test', (_req, res) => {
    res.send('Hello, world!');
});

// Error-handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
