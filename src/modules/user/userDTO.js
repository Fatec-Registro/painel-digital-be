import { z } from 'zod';

// Utilizado para a validação da criação de usuário
export const createUserSchema = z.object({
    name: z.string(),
    password: z.string()
});

// Utilizado para a validação da criação de usuário
export const updateUserSchema = z.object({
    name: z.string().optional(),
    password: z.string().optional()
});

