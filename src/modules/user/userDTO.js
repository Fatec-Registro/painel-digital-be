import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const objectIdRegex = /^[a-f\d]{24}$/i;
const perfisPermitidos = ['solicitante', 'designer', 'suporte', 'visualizacao'];
const departamentosPermitidos = [
  'Atlética',
  'Coordenação',
  'Direção',
  'Administrativo',
  'Secretaria',
  'DTI'
];

export const createUserSchema = z.object({
  nome: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
  email: z.string().regex(emailRegex, { message: 'Formato do email inválido' }),
  senha: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
  perfil: z.enum(perfisPermitidos, { message: 'Perfil inválido' }),
  departamento: z.enum(departamentosPermitidos, { message: 'Departamento inválido' }),
  criadoPor: z.string().regex(objectIdRegex, { message: 'ID do criador inválido' }),
  ativo: z.boolean().optional()
});

export const updateUserSchema = createUserSchema.partial();
