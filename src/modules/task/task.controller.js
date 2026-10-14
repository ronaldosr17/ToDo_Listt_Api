export function createTaskController(taskService) {
    return {
        async list(req, res, next) {
            try {
                res.json(await taskService.listTasks(req.user.id));
            } catch (error) {
                next(error);
            }
        },

        async getById(req, res, next) {
            try {
                res.json(await taskService.getTask(req.user.id, req.params.id));
            } catch (error) {
                next(error);
            }
        },

        async create(req, res, next) {
            try {
                const task = await taskService.createTask(req.user.id, req.body);
                res.status(201).json(task);
            } catch (error) {
                next(error);
            }
        },

        async update(req, res, next) {
            try {
                const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
                res.json(task);
            } catch (error) {
                next(error);
            }
        },

        async remove(req, res, next) {
            try {
                await taskService.deleteTask(req.user.id, req.params.id);
                res.status(204).send();
            } catch (error) {
                next(error);
            }
        },
    };
}