import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().trim().min(1, { message: 'Title is required' }).max(200),
    description: z.string().trim().max(1000).optional().default(''),
    done: z.boolean().optional().default(false),
});

export const updateTaskSchema = z
    .object({
        title: z.string().trim().min(1).max(200).optional(),
        description: z.string().trim().max(1000).optional(),
        done: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field is required',
    });

export const taskIdSchema = z.object({
    id: z.coerce.number().int().positive(),
});