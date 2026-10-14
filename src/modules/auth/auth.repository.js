import { unwrap } from '../../lib/supabase.js';

export function createAuthRepository(supabase) {
    return {
        async findByEmail(email) {
            return unwrap(
                await supabase
                    .from('users')
                    .select('id, email, password_hash')
                    .eq('email', email)
                    .maybeSingle()
            );
        },

        async create({ email, passwordHash }) {
            return unwrap(
                await supabase
                    .from('users')
                    .insert({ email, password_hash: passwordHash })
                    .select('id, email, created_at')
                    .single()
            );
        },
    };
}