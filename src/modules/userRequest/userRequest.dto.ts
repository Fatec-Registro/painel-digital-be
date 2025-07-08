import { z } from 'zod';

const perfisPermitidos = ['solicitante', 'designer', 'suporte', 'visualizacao'] as const;
const departamentosPermitidos = [
  'Atlética',
  'Coordenação',
  'Direção',
  'Administrativo',
  'Secretaria',
  'DTI'
] as const;

export const createUserRequestSchema = z.object({
  nome: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
  email: z.string().email({ message: 'Formato do email inválido' }),
  senhaTemporaria: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
  perfil: z.enum(perfisPermitidos, { errorMap: () => ({ message: 'Perfil inválido' }) }),
  departamento: z.enum(departamentosPermitidos, { errorMap: () => ({ message: 'Departamento inválido' }) }),
  criadoPor: z.string().regex(/^[a-f\d]{24}$/i, { message: 'ID do criador inválido' }),
  analisadoPor:  z.string().regex(/^[a-f\d]{24}$/i, { message: 'ID do analisador inválido' }).optional(),
});

export const updateUserRequestSchema = createUserRequestSchema.partial();

export type CreateUserRequestDTO = z.infer<typeof createUserRequestSchema>;
export type UpdateUserRequestDTO = z.infer<typeof updateUserRequestSchema>;