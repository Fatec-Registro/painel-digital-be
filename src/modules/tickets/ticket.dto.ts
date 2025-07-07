import { z } from 'zod';
import { Types } from 'mongoose';
import { TicketStatus } from './tickets.model.js';

// Criamos um validador customizado para ObjectId do Mongoose
const objectIdSchema = z.string().refine((val) => {
  return Types.ObjectId.isValid(val);
}, {
  message: "O ID fornecido não é um ObjectId válido.",
});

// Schema base com todas as regras de validação para um ticket
const ticketBaseSchema = z.object({
  solicitanteId: objectIdSchema,
  titulo: z
    .string({ required_error: "O título é obrigatório." })
    .min(3, { message: "O título deve ter no mínimo 3 caracteres." }),
  descricao: z
    .string({ required_error: "A descrição é obrigatória." })
    .min(10, { message: "A descrição deve ter no mínimo 10 caracteres." }),
  tempo_exibicao: z
    .number({ required_error: "O tempo de exibição é obrigatório." })
    .int()
    .min(1, { message: "O tempo de exibição deve ser de no mínimo 1 segundo." }),
  
  // Campos opcionais
  designerId: objectIdSchema.optional(),
  eventoId: objectIdSchema.optional(),
  briefing: z.array(objectIdSchema).optional(),
  arquivosMidia: z.array(objectIdSchema).optional(),
  
  //o status é opcional no schema de criação, mas deve ser um dos valores do enum TicketStatus
  status: z.nativeEnum(TicketStatus).optional(),
});
// o schema de criação não inclui o status, pois ele é definido automaticamente no modelo
export const createTicketSchema = ticketBaseSchema.omit({ 
  status: true 
});

// o schema de atualização permite que todos os campos sejam opcionais,
export const updateTicketSchema = ticketBaseSchema.partial();

// isso serve para inferir os tipos do Zod e exportar como DTOs
export type CreateTicketDTO = z.infer<typeof createTicketSchema>;
export type UpdateTicketDTO = z.infer<typeof updateTicketSchema>;