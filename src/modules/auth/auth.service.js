import bcrypt from 'bcryptjs';
import { signToken } from '../../lib/jwt.js';
import { env } from '../../config/env.js';
import { HttpError } from '../../Utils/httpError.js';

export function createAuthService(authRepository) {
    return {
        async register({ email, password }) {
            const existing = await authRepository.findByEmail(email);
            if (existing) throw HttpError.conflict('El email ya está registrado');

            const passwordHash = await bcrypt.hash(password, 10);
            return authRepository.create({ email, passwordHash });
        },

        async login({ email, password }) {
            const user = await authRepository.findByEmail(email);
            const valid = user && (await bcrypt.compare(password, user.password_hash));

            // Mismo mensaje si el usuario no existe o la contraseña falla: no damos pistas.
            if (!valid) throw HttpError.unauthorized('Credenciales inválidas');

            return {
                accessToken: signToken(user),
                tokenType: 'Bearer',
                expiresIn: env.JWT_EXPIRES_IN,
            };
        },
    };
}