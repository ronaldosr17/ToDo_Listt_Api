import { verifyToken } from '../lib/jwt.js';
import { HttpError } from '../Utils/httpError.js';

export function requireAuth(req, res, next) {
    const [scheme, token] = (req.get('authorization') ?? '').split(' ');

    if (scheme !== 'Bearer' || !token) {
        return next(HttpError.unauthorized('Falta el header Authorization: Bearer <token>'));
    }

    try {
        const payload = verifyToken(token);
        req.user = { id: payload.sub, email: payload.email };
    } catch {
        return next(HttpError.unauthorized('Token inválido o expirado'));
    }

    next();
}