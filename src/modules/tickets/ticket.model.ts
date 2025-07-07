import { Schema, model, Document, Types } from 'mongoose';

export enum TicketStatus {
  SOLICITADO = 'solicitado',
  EM_DESENVOLVIMENTO = 'em_desenvolvimento',
  AGUARDANDO_APROVACAO = 'aguardando_aprovacao',
  EM_EXIBICAO = 'em_exibicao',
  EXPIRADO = 'expirado',
}

// Interface do Ticket
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

// Campos de referência reutilizáveis
const refUser = {
  type: Schema.Types.ObjectId,
  ref: 'User',
};

const refArquivoMidia = {
  type: Schema.Types.ObjectId,
  ref: 'arquivosmidia',
};

const refEvento = {
  type: Schema.Types.ObjectId,
  ref: 'eventos',
};

// Schema do Ticket
const TicketSchema = new Schema<ITicket>(
  {
    solicitanteId: {
      ...refUser,
      required: true,
    },
    designerId: {
      ...refUser,
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
    briefing: [refArquivoMidia],
    arquivosMidia: [refArquivoMidia],
    tempo_exibicao: {
      type: Number,
      required: true,
    },
    dataAbertura: {
      type: Date,
      default: Date.now,
    },
    eventoId: {
      ...refEvento,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const TicketModel = model<ITicket>('Ticket', TicketSchema);
