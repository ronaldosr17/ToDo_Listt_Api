import { Router } from 'express';
import { healthRouter } from './modules/health/health.router.js';
import { tasksRouter } from './modules/task/task.router.js';
import { authRouter } from './modules/auth/auth.router.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/tasks', tasksRouter);