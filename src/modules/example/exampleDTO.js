import { z } from 'zod';

// Validação do Doc. aninhado
const addressSchema = z.object({
    country: z.string(),
    state: z.string(),
    city: z.string(),
    district: z.string()
});

// Utilizado para a validação da criação de algum Doc.
export const createExampleSchema = z.object({
    name: z.string(),
    year: z.number(),
    typeUser: z.enum(['Solicitante', 'Design', 'Suporte']),
    address: z.array(addressSchema),
    dateOfBirth: z.coerce.date()
});

// Utilizado para a atualização validação de algum Doc.
export const updateExampleSchema = z.object({
    name: z.string().optional(),
    year: z.number().optional(),
    typeUser: z.enum(['Solicitante', 'Design', 'Suporte']).optional(),
    address: z.array(addressSchema).optional(),
    dateOfBirth: z.coerce.date().optional()
});
