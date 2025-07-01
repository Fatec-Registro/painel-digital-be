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
    age: z.number(),
    typeUser: z.enum(['Solicitante', 'Design', 'Suporte']),
    address: z.array(addressSchema),
    dateOfBirth: z.coerce.date()
});

// Utilizado para a validação da atualização de algum Doc.
export const updateExampleSchema = z.object({
    name: z.string().optional(),
    age: z.number().optional(),
    typeUser: z.enum(['Solicitante', 'Design', 'Suporte']).optional(),
    address: z.array(addressSchema).optional(),
    dateOfBirth: z.coerce.date().optional()
});

export type CreateExampleDTO = z.infer<typeof createExampleSchema>;
export type UpdateExampleDTO = z.infer<typeof updateExampleSchema>;