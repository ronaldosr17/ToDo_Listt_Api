import { Router } from 'express';
import { supabase } from '../../lib/supabase.js';
import { validateSchema } from '../../middlewares/validate.js';
import { requireAuth } from '../../middlewares/auth.js';
import { createAuthRepository } from './auth.repository.js';
import { createAuthService } from './auth.service.js';
import { createAuthController } from './auth.controller.js';
import { credentialsSchema } from './auth.schema.js';

const authRepository = createAuthRepository(supabase);
const authService = createAuthService(authRepository);
const authController = createAuthController(authService);

export const authRouter = Router();

authRouter.post('/register', validateSchema(credentialsSchema), authController.register);
authRouter.post('/login', validateSchema(credentialsSchema), authController.login);
authRouter.get('/me', requireAuth, authController.me);