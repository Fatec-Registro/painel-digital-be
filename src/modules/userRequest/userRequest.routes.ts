import express from "express";
import userRequestController from "./userResquest.controller.js";
import Auth from "../../middleware/Auth.js";

const userRequestRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: UserRequests
 *   description: Solicitações de criação de usuário
 */

/**
 * @swagger
 * /user-requests:
 *   get:
 *     summary: Listar todas as solicitações de criação de usuário
 *     tags: [UserRequests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitações retornada com sucesso
 *       500:
 *         description: Internal Server Error
 */
userRequestRoutes.get("/user-requests", Auth.Authorization, userRequestController.getAllRequests);

/**
 * @swagger
 * /user-request/{id}:
 *   get:
 *     summary: Buscar uma solicitação específica pelo ID
 *     tags: [UserRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da solicitação
 *     responses:
 *       200:
 *         description: Solicitação encontrada
 *       404:
 *         description: Solicitação não encontrada
 *       500:
 *         description: Internal Server Error
 */
userRequestRoutes.get("/user-request/:id", Auth.Authorization, userRequestController.getRequestById);

/**
 * @swagger
 * /user-request:
 *   post:
 *     summary: Criar nova solicitação de criação de usuário
 *     tags: [UserRequests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRequest'
 *     responses:
 *       201:
 *         description: Solicitação criada
 *       400:
 *         description: Erro de validação
 *       409:
 *         description: E-mail já cadastrado
 *       500:
 *         description: Internal Server Error
 */
userRequestRoutes.post("/user-request", Auth.Authorization, userRequestController.createRequest);

/**
 * @swagger
 * /user-request/approve/{id}:
 *   patch:
 *     summary: Aprovar uma solicitação de usuário
 *     tags: [UserRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da solicitação
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Solicitação aprovada e usuário criado
 *       400:
 *         description: Solicitação inválida
 *       500:
 *         description: Internal Server Error
 */
userRequestRoutes.patch("/user-request/approve/:id", Auth.Authorization, userRequestController.approveRequest);

/**
 * @swagger
 * /user-request/reject/{id}:
 *   patch:
 *     summary: Rejeitar uma solicitação de usuário
 *     tags: [UserRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da solicitação
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Solicitação rejeitada
 *       400:
 *         description: Solicitação inválida
 *       500:
 *         description: Internal Server Error
 */
userRequestRoutes.patch("/user-request/reject/:id", Auth.Authorization, userRequestController.rejectRequest);

/**
 * @swagger
 * /user-request/cancel/{id}:
 *   patch:
 *     summary: Cancelar uma solicitação (pelo criador)
 *     tags: [UserRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da solicitação
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Solicitação cancelada com sucesso
 *       400:
 *         description: Solicitação não encontrada ou já processada
 *       500:
 *         description: Internal Server Error
 */
userRequestRoutes.patch("/user-request/cancel/:id", Auth.Authorization, userRequestController.cancelRequest);

export default userRequestRoutes;
