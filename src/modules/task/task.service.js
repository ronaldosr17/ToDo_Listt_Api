import { HttpError } from '../../Utils/httpError.js';

export function createTaskService(taskRepository) {
    return {
        listTasks(userId) {
            return taskRepository.list(userId);
        },

        async getTask(userId, id) {
            const task = await taskRepository.getById(userId, id);
            if (!task) throw new HttpError(404, 'Task not found');
            return task;
        },

        createTask(userId, data) {
            return taskRepository.create(userId, data);
        },

        async updateTask(userId, id, changes) {
            const task = await taskRepository.update(userId, id, changes);
            if (!task) throw new HttpError(404, 'Task not found');
            return task;
        },

        async deleteTask(userId, id) {
            const removed = await taskRepository.remove(userId, id);
            if (!removed) throw new HttpError(404, 'Task not found');
        },
    };
}