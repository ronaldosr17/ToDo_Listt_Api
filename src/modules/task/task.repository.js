import { unwrap } from '../../lib/supabase.js';

export function createTaskRepository(supabase) {
    return {
        async list(userId) {
            return unwrap(
                await supabase
                    .from('tasks')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false })
            );
        },

        async getById(userId, id) {
            return unwrap(
                await supabase
                    .from('tasks')
                    .select('*')
                    .eq('id', id)
                    .eq('user_id', userId)
                    .maybeSingle()
            );
        },

        async create(userId, task) {
            return unwrap(
                await supabase
                    .from('tasks')
                    .insert({ ...task, user_id: userId })
                    .select()
                    .single()
            );
        },

        async update(userId, id, changes) {
            return unwrap(
                await supabase
                    .from('tasks')
                    .update(changes)
                    .eq('id', id)
                    .eq('user_id', userId)
                    .select()
                    .maybeSingle()
            );
        },

        async remove(userId, id) {
            const rows = unwrap(
                await supabase
                    .from('tasks')
                    .delete()
                    .eq('id', id)
                    .eq('user_id', userId)
                    .select()
            );
            return rows.length > 0;
        },
    };
}