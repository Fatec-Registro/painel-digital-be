import express from "express";
import ticketController from "./ticket.controller.js";
import Auth from "../../middleware/Auth.js";

const ticketRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Operações relacionadas aos tickets
 */

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Lista todos os tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao buscar tickets
 */
ticketRoutes.get("/tickets", Auth.Authorization, ticketController.getAllTickets);

/**
 * @swagger
 * /ticket:
 *   post:
 *     summary: Cria um novo ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTicketDTO'
 *     responses:
 *       201:
 *         description: Ticket criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao criar ticket
 */
ticketRoutes.post("/ticket", Auth.Authorization, ticketController.createTicket);

/**
 * @swagger
 * /ticket/{id}:
 *   get:
 *     summary: Busca um ticket específico por ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do ticket
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao buscar ticket
 */
ticketRoutes.get("/ticket/:id", Auth.Authorization, ticketController.getOneTicket);

/**
 * @swagger
 * /ticket/{id}:
 *   patch:
 *     summary: Atualiza um ticket existente
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do ticket
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTicketDTO'
 *     responses:
 *       200:
 *         description: Ticket atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Ticket não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao atualizar ticket
 */
ticketRoutes.patch("/ticket/:id", Auth.Authorization, ticketController.updateTicket);

/**
 * @swagger
 * /ticket/{id}:
 *   delete:
 *     summary: Remove um ticket por ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do ticket
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket deletado com sucesso
 *       404:
 *         description: Ticket não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao deletar ticket
 */
ticketRoutes.delete("/ticket/:id", Auth.Authorization, ticketController.deleteTicket);

export default ticketRoutes;
