import express from "express";
import userController from "./user.controller.js";
import Auth from "../../middleware/Auth.js";

const userRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operações relacionadas a Usuários
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar todos os usuários
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *       500:
 *         description: Internal Server Error
 */
userRoutes.get("/users", Auth.Authorization, userController.getAllUsers);

/**
 * @swagger
 * /user/{email}:
 *   get:
 *     summary: Procurar um usuário específico pelo email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email do usuário a ser buscado
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: Usuário encontrado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Internal Server Error
 */
userRoutes.get("/user/:email", Auth.Authorization, userController.getOneUser);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Criar um novo usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Requisição inválida - erro de validação Zod
 *       409:
 *         description: Conflito - E-mail já cadastrado
 *       500:
 *         description: Internal Server Error
 */
userRoutes.post("/user", Auth.Authorization, userController.createUser);

/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Atualizar um usuário existente
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser atualizado (ObjectId do MongoDB)
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Requisição inválida - erro de validação Zod
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Internal Server Error
 */
userRoutes.patch("/user/:id", Auth.Authorization, userController.updateUser);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Deletar um usuário específico
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser deletado (ObjectId do MongoDB)
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Internal Server Error
 */
userRoutes.delete("/user/:id", Auth.Authorization, userController.deleteUser);

export default userRoutes;
