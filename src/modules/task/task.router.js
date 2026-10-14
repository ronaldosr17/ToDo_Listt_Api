import { Router } from 'express';
import { supabase } from '../../lib/supabase.js';
import { validateSchema } from '../../middlewares/validate.js';
import { requireAuth } from '../../middlewares/auth.js';
import { createTaskRepository } from './task.repository.js';
import { createTaskService } from './task.service.js';
import { createTaskController } from './task.controller.js';
import { createTaskSchema, updateTaskSchema, taskIdSchema } from './task.schema.js';

const taskRepository = createTaskRepository(supabase);
const taskService = createTaskService(taskRepository);
const taskController = createTaskController(taskService);

export const tasksRouter = Router();

tasksRouter.use(requireAuth); // todas las rutas de tareas requieren token

tasksRouter.get('/', taskController.list);
tasksRouter.get('/:id', validateSchema(taskIdSchema, 'params'), taskController.getById);
tasksRouter.post('/', validateSchema(createTaskSchema), taskController.create);
tasksRouter.patch(
    '/:id',
    validateSchema(taskIdSchema, 'params'),
    validateSchema(updateTaskSchema),
    taskController.update
);
tasksRouter.delete('/:id', validateSchema(taskIdSchema, 'params'), taskController.remove);