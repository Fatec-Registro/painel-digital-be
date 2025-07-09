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
 *     description: |
 *       Retorna lista de solicitações filtradas por perfil:
 *       - Suporte/DTI: visualiza todas
 *       - Outros perfis: visualiza apenas do próprio departamento
 *     tags: [UserRequests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitações retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requests:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserRequest'
 *       401:
 *         description: Não autorizado (token inválido ou ausente)
 *       500:
 *         description: Erro interno do servidor
 */
userRequestRoutes.get("/user-requests", Auth.Authorization, userRequestController.getAllRequests);

/**
 * @swagger
 * /user-requests/{id}:
 *   get:
 *     summary: Busca uma solicitação específica pelo ID
 *     description: Retorna os detalhes de uma solicitação de criação de usuário pelo seu ID
 *     tags: [UserRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "686d467f7b1c8875f5c04ecc"
 *         description: ID da solicitação
 *     responses:
 *       200:
 *         description: Solicitação encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRequest'
 *       400:
 *         description: ID inválido (formato incorreto)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID inválido"
 *       404:
 *         description: Solicitação não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Solicitação não encontrada"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao buscar solicitação"
 */
userRequestRoutes.get("/user-request/:id", Auth.Authorization, userRequestController.getRequestById);

/**
 * @swagger
 * /user-request:
 *   post:
 *     summary: Cria uma nova solicitação de usuário
 *     description: |
 *       Cria uma solicitação de criação de usuário com validações:
 *       - Validação de schema com Zod
 *       - Restrição por departamento (exceto DTI)
 *       - Verificação de e-mail duplicado
 *     tags: [UserRequests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: Solicitação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRequest'
 *       400:
 *         description: Erro de validação dos dados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro de validação"
 *                 details:
 *                   type: object
 *                   properties:
 *                     fieldErrors:
 *                       type: object
 *                       example: { "email": ["E-mail inválido"] }
 *                     formErrors:
 *                       type: array
 *                       items:
 *                         type: string
 *       403:
 *         description: Acesso não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Você só pode solicitar usuários para seu próprio departamento"
 *       409:
 *         description: Conflito - E-mail já está em uso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Já existe uma solicitação pendente ou aprovada com este e-mail"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao criar solicitação"
 */
userRequestRoutes.post("/user-request", Auth.Authorization, userRequestController.createRequest);

/**
 * @swagger
 * /user-request/approve/:id:
 *   patch:
 *     summary: Aprova uma solicitação de criação de usuário
 *     description: |
 *       Aprova uma solicitação pendente e cria o usuário correspondente.
 *       Requer perfil de suporte/DTI para execução.
 *     tags: [UserRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         description: ID da solicitação a ser aprovada
 *     responses:
 *       200:
 *         description: Usuário criado e solicitação aprovada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: ID inválido ou solicitação já processada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID inválido"
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário não autenticado"
 *       403:
 *         description: Acesso não autorizado (requer perfil suporte/DTI)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Você não tem permissão para aprovar solicitações"
 *       404:
 *         description: Solicitação não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Solicitação não encontrada"
 *       409:
 *         description: Conflito (solicitação já processada)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Solicitação já processada"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao aprovar solicitação"
 */
userRequestRoutes.patch("/user-request/approve/:id", Auth.Authorization, userRequestController.approveRequest);

/**
 * @swagger
 * /user-request/reject/:id:
 *   patch:
 *     summary: Rejeita uma solicitação de criação de usuário
 *     description: |
 *       Rejeita uma solicitação pendente, atualizando seu status para "rejeitado" e registrando quem analisou e quando.
 *       Requer perfil de suporte/DTI para execução.
 *     tags: [UserRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "686d6fd368bec2013e8397a1"
 *         description: ID da solicitação a ser rejeitada
 *     responses:
 *       200:
 *         description: Solicitação rejeitada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RejectedUserRequest'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Você não tem permissão para aprovar ou rejeitar solicitações.
 *       404:
 *         description: Solicitação não encontrada
 *       409:
 *         description: Conflito (solicitação já processada)
 *       500:
 *         description: Erro ao rejeitar solicitação
 */
userRequestRoutes.patch("/user-request/reject/:id", Auth.Authorization, userRequestController.rejectRequest);

/**
 * @swagger
 * /user-request/delete/:id:
 *   delete:
 *     summary: Exclui uma solicitação de criação de usuário
 *     description: |
 *       Exclui uma solicitação pendente.
 *       - Usuários DTI podem excluir qualquer solicitação
 *       - Outros usuários só podem excluir solicitações do próprio departamento
 *     tags: [UserRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         description: ID da solicitação a ser excluída
 *     responses:
 *       204:
 *         description: No content
 *       400:
 *         description: ID inválido ou formato incorreto
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso não autorizado
 *       404:
 *         description: Solicitação não encontrada
 *       409:
 *         description: Conflito (solicitação já processada)
 *       500:
 *         description: Erro interno do servidor
 */
userRequestRoutes.delete("/user-request/delete/:id", Auth.Authorization, userRequestController.deleteRequest);



/**
 * @swagger
 * components:
 *   schemas:
 *     UserRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "686d467f7b1c8875f5c04ecc"
 *         nome:
 *           type: string
 *           example: "João da Silva"
 *         email:
 *           type: string
 *           example: "joao.silva@exemplo.com"
 *         perfil:
 *           type: string
 *           example: "designer"
 *         departamento:
 *           type: string
 *           example: "DTI"
 *         criadoPor:
 *           type: string
 *           example: "60f8a8bba2e7f4c6e4a0b9d3"
 *         status:
 *           type: string
 *           enum: [pendente, aprovado, rejeitado]
 *           example: "aprovado"
 *         dataSolicitacao:
 *           type: string
 *           format: date-time
 *           example: "2025-07-08T16:25:35.334Z"
 *         dataDecisao:
 *           type: string
 *           format: date-time
 *           example: "2025-07-08T16:34:58.748Z"
 *         analisadoPor:
 *           type: string
 *           example: "686d2d4db43fda981f607f62"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - perfil
 *         - departamento
 *       properties:
 *         nome:
 *           type: string
 *           example: "João da Silva"
 *         email:
 *           type: string
 *           format: email
 *           example: "joao.silva@exemplo.com"
 *         perfil:
 *           type: string
 *           enum: [designer, desenvolvedor, suporte, gerente]
 *           example: "designer"
 *         departamento:
 *           type: string
 *           example: "DTI"
 *         senhaTemporaria:
 *           type: string
 *           description: Senha temporária (opcional)
 *           example: "Senha@123"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         nome:
 *           type: string
 *           example: "João da Silva"
 *         email:
 *           type: string
 *           example: "joao.silva@exemplo.com"
 *         perfil:
 *           type: string
 *           enum: [designer, desenvolvedor, suporte, gerente]
 *           example: "designer"
 *         departamento:
 *           type: string
 *           example: "DTI"
 *         criadoPor:
 *           type: string
 *           example: "507f1f77bcf86cd799439012"
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T12:00:00Z"
 *         status:
 *           type: boolean
 *           example: true
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     RejectedUserRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "686d6fd368bec2013e8397a1"
 *         nome:
 *           type: string
 *           example: "João da Silva"
 *         email:
 *           type: string
 *           example: "cc@gmail.com"
 *         perfil:
 *           type: string
 *           example: "suporte"
 *         departamento:
 *           type: string
 *           example: "Coordenação"
 *         criadoPor:
 *           type: string
 *           example: "686d2d4db43fda981f607f62"
 *         status:
 *           type: string
 *           enum: [pendente, aprovado, rejeitado]
 *           example: "rejeitado"
 *         dataSolicitacao:
 *           type: string
 *           format: date-time
 *           example: "2025-07-08T19:21:55.262Z"
 *         dataDecisao:
 *           type: string
 *           format: date-time
 *           example: "2025-07-08T23:45:31.758Z"
 *         analisadoPor:
 *           type: string
 *           example: "686d2d4db43fda981f607f62"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-07-08T19:21:55.262Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-07-08T23:45:31.763Z"
 *         __v:
 *           type: integer
 *           example: 0
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Mensagem de erro específica"
 *       required:
 *         - message
 */

export default userRequestRoutes;
