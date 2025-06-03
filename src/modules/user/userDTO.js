import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Utilizado para a validação da criação de usuário
export const createUserSchema = z.object({
    email: z.string().regex(emailRegex, { message: "Formato do email inválido" }),
    password: z.string()
});

// Utilizado para a validação da criação de usuário
export const updateUserSchema = z.object({
    email: z.string().regex(emailRegex, { message: "Formato do email inválido" }).optional(),
    password: z.string().optional()
});

