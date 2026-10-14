import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { apiRouter } from './routes.js';

export function createApp() {
    const app = express();

    app.use(cors());
    app.use(morgan('dev'));
    app.use(express.json());

    app.use('/api', apiRouter);

    app.use((req, res) => {
        res.status(404).json({ error: 'Not found' });
    });

    app.use((err, req, res, next) => {
        const status = err.status ?? 500;
        if (status >= 500) console.error(err);
        res.status(status).json({
            error: status >= 500 ? 'Internal server error' : err.message,
        });
    });

    return app;
}