import { Schema, model, Document, Types } from 'mongoose';

export enum TicketStatus {
  SOLICITADO = 'solicitado',
  EM_DESENVOLVIMENTO = 'em_desenvolvimento',
  AGUARDANDO_APROVACAO = 'aguardando_aprovacao',
  EM_EXIBICAO = 'em_exibicao',
  EXPIRADO = 'expirado',
}

// A interface do Ticket 
export interface ITicket extends Document {
  solicitanteId: Types.ObjectId;
  designerId?: Types.ObjectId;
  titulo: string;
  status: TicketStatus;
  descricao: string;
  briefing?: Types.ObjectId[];
  arquivosMidia?: Types.ObjectId[];
  tempo_exibicao: number;
  dataAbertura: Date;
  eventoId?: Types.ObjectId;
}

// Schema do Mongoose com as referências
const TicketSchema = new Schema<ITicket>({
  solicitanteId: {
    type: Schema.Types.ObjectId,
    ref: 'usuarios',
    required: true,
  },
  designerId: {
    type: Schema.Types.ObjectId,
    ref: 'usuarios', 
    required: false,
  },
  titulo: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(TicketStatus),
    default: TicketStatus.SOLICITADO,
  },
  descricao: {
    type: String,
    required: true,
  },
  briefing: [{
    type: Schema.Types.ObjectId,
    ref: 'arquivosmidia', 
  }],
  arquivosMidia: [{
    type: Schema.Types.ObjectId,
    ref: 'arquivosmidia',
  }],
  tempo_exibicao: {
    type: Number,
    required: true,
  },
  dataAbertura: {
    type: Date,
    default: Date.now,
  },
  eventoId: {
    type: Schema.Types.ObjectId,
    ref: 'eventos',
    required: false,
  },
}, {
  timestamps: true,
  versionKey: false
});

export const TicketModel = model<ITicket>('tickets', TicketSchema);