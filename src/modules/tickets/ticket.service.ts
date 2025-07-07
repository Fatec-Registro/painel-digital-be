import User from '../user/user.model.js';
import { TicketModel, ITicket } from './ticket.model.js';
import { CreateTicketDTO, UpdateTicketDTO, updateTicketSchema } from './ticket.dto.js';
import { ZodError } from 'zod';

class TicketService {
  /**
   * Busca todos os tickets com dados dos usuários populados.
   */
  async getAll(): Promise<ITicket[]> {
    try {
      return await TicketModel.find().populate([
        { path: 'solicitanteId', select: 'nome email' },
        { path: 'designerId', select: 'nome email' },
      ]);
    } catch (error) {
      console.error('Erro ao buscar todos os tickets:', error);
      throw new Error('Falha ao buscar tickets.');
    }
  }

  /**
   * Busca um único ticket pelo ID.
   */
  async getOne(id: string): Promise<ITicket | null> {
    try {
      return await TicketModel.findById(id).populate([
        { path: 'solicitanteId', select: 'nome email' },
        { path: 'designerId', select: 'nome email' },
      ]);
    } catch (error) {
      console.error(`Erro ao buscar o ticket ${id}:`, error);
      throw new Error('Falha ao buscar o ticket.');
    }
  }

  /**
   * Cria um novo ticket.
   */
  async create(data: CreateTicketDTO): Promise<ITicket> {
    try {
      const newTicket = new TicketModel(data);
      await newTicket.save();
      return newTicket;
    } catch (error) {
      console.error('Erro na criação de um novo Ticket:', error);
      throw new Error('Falha ao criar um novo ticket.');
    }
  }

  /**
   * Atualiza um ticket existente.
   */
  async update(id: string, data: UpdateTicketDTO): Promise<ITicket | null> {
    try {
      const validatedData = updateTicketSchema.parse(data);
      const updatedTicket = await TicketModel.findByIdAndUpdate(id, validatedData, { new: true });

      if (!updatedTicket) {
        console.log(`Nenhum ticket com o ID: ${id} foi encontrado para a atualização.`);
        return null;
      }

      return updatedTicket;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(`Dados inválidos: ${error.errors.map(e => e.message).join(', ')}`);
      }

      console.error(`Erro ao atualizar o ticket ${id}:`, error);
      throw new Error('Falha ao atualizar o ticket.');
    }
  }

  /**
   * Deleta um ticket pelo ID.
   */
  async delete(id: string): Promise<ITicket | null> {
    try {
      const ticket = await TicketModel.findByIdAndDelete(id);

      if (!ticket) {
        console.log(`Nenhum Ticket com o ID: ${id} foi encontrado.`);
        return null;
      }

      return ticket;
    } catch (error) {
      console.error(`Erro ao deletar o ticket ${id}:`, error);
      throw new Error('Falha ao deletar o ticket.');
    }
  }
}

export default new TicketService();
