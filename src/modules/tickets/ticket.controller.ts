import { Request, Response } from "express";
import ticketService from "./ticket.service.js";
import { createTicketSchema } from "./ticket.dto.js";
import mongoose from "mongoose";
import { ZodError } from "zod";

/**
 * @description Busca todos os tickets.
 */
const getAllTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const tickets = await ticketService.getAll();
    res.status(200).json({ tickets });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @description Busca um ticket pelo seu ID.
 */
const getOneTicket = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }
    const ticket = await ticketService.getOne(id);
    if (!ticket) {
      res.status(404).json({ message: "Ticket Not Found" });
    } else {
      res.status(200).json(ticket);
    }
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @description Cria um novo ticket.
 */
const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = createTicketSchema.parse(req.body);
    const ticket = await ticketService.create(parsedData);
    res.status(201).json(ticket);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof ZodError) {
      res.status(400).json({ message: "Validation error", details: error.flatten() });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

/**
 * @description Atualiza um ticket pelo ID.
 */
const updateTicket = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }
    const ticket = await ticketService.update(id, req.body);
    if (!ticket) {
      res.status(404).json({ message: "Ticket Not Found" });
    } else {
      res.status(200).json(ticket);
    }
  } catch (error: unknown) {
    console.error(error);
    // O erro de validação do Zod é lançado pelo service neste caso
    if (error instanceof Error && error.message.includes("Dados inválidos")) {
       res.status(400).json({ message: "Validation error", details: error.message });
    } else {
       res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

/**
 * @description Deleta um ticket pelo ID.
 */
const deleteTicket = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }
    const deletedTicket = await ticketService.delete(id);
    if (!deletedTicket) {
      res.status(404).json({ message: "Ticket Not Found" });
    } else {
      res.sendStatus(204); // Sem conteúdo
    }
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default {
  getAllTickets,
  getOneTicket,
  createTicket,
  updateTicket,
  deleteTicket,
};