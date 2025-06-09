import { z } from 'zod';

export const panelSchema = z.object({
  nome: z.string({
    required_error: 'O nome é obrigatório.',
    invalid_type_error: 'O nome deve ser um texto.',
  }).min(3, { message: 'O nome deve ter no mínimo 3 caracteres.' }),

  localizacao: z.string({
    required_error: 'A localização é obrigatória.',
  }).min(3, { message: 'A localização deve ter no mínimo 3 caracteres.' }),
  
  descricao: z.string().max(255).optional(),

  ip_maquina: z.string({
    required_error: 'O IP da máquina é obrigatório.',
  }).ip({ version: "v4", message: "Endereço de IP inválido." }),

  status: z.enum(['ativo', 'inativo', 'manutencao']).optional(),

  isSmartTV: z.boolean().optional(),
  
  temCaboRede: z.boolean().optional(),

  quantasEntradasHDMI: z.number({
    invalid_type_error: "A quantidade de entradas HDMI deve ser um número.",
  }).int().min(0).optional(),

  marcaTV: z.string().optional(),
});