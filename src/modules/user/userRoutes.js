import express from "express";
import userController from "./userController.js";
import Auth from "../../middleware/Auth.js";

const userRoutes = express.Router();

/**
 * @swagger
 * tags:
 *  - name: Users
 *    description: Operações relacionadas a Usuários
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
 *           description: "Identificador único do usuário (ObjectId do MongoDB)"
 *           example: "665fd6e8c5e1f2d7f74a1b5a"
 *         nome:
 *           type: string
 *           example: "Davi Mathais"
 *         email:
 *           type: string
 *           format: email
 *           example: "davialmeida@gmail.com"
 *         senha:
 *           type: string
 *           format: password
 *           description: "Senha do usuário (armazenada de forma criptografada no banco de dados)"
 *           example: "Senhaforte123"
 *         perfil:
 *           type: string
 *           description: "Perfil de acesso do usuário"
 *           enum: ["solicitante", "designer", "suporte", "visualizacao"]
 *           example: "solicitante"
 *         departamento:
 *           type: string
 *           description: "Departamento ao qual o usuário pertence"
 *           enum: ["Atlética", "Coordenação", "Direção", "Administrativo", "Secretaria", "DTI"]
 *           example: "Administrativo"
 *         criadoPor:
 *           type: string
 *           description: "ID do usuário que criou este usuário (ObjectId do MongoDB)"
 *           example: "665fd6e8c5e1f2d7f74a1b5b"
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: "Data de criação do usuário"
 *           example: "2025-10-01T12:00:00Z"
 *         ativo:
 *           type: boolean
 *           description: "Indica se o usuário está ativo ou não"
 *           example: true
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: "Listar todos os usuários"
 *     tags: [Users]
 *     security: 
 *       - bearerAuth: []
 *     responses:
 *       200: 
 *         description: "Lista de usuários retornada com sucesso"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: "Internal Server Error" 
 */
userRoutes.get("/users", Auth.Authorization, userController.getAllUsers);

/**
 * @swagger
 * /user/{email}:
 *   get:
 *     summary: "Procurar um usuário específico pelo email dele"
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         description: "Email do usuário a ser buscado"
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: "Usuário encontrado com sucesso"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: "Requisição inválida"
 *       404:
 *         description: "Usuário não encontrado"
 *       500:
 *         description: "Internal Server Error"
 */
userRoutes.get("/user/:email", Auth.Authorization, userController.getOneUser);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: "Criar um novo usuário"
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: "Usuário criado com sucesso"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: "Requisição inválida - erro de validação Zod"
 *       500:
 *         description: "Internal Server Error"
 */
userRoutes.post("/user", userController.createUser);


/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: "Atualizar um usuário existente"
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: "ID do usuário a ser atualizado (ObjectId do MongoDB)"
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
 *         description: "Usuário atualizado com sucesso"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: "Requisição inválida - erro de validação Zod"
 *       404:
 *         description: "Usuário não encontrado"
 *       500:
 *         description: "Internal Server Error"
 */
userRoutes.patch("/user/:id", Auth.Authorization, userController.updateUser);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: "Deletar um usuário específico"
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: "ID do usuário a ser deletado (ObjectId do MongoDB)"
 *         schema:
 *           type: string
 *     responses:
 *       204: 
 *         description: "Usuário deletado com sucesso"
 *       400:
 *         description: "Requisição inválida"
 *       404:
 *         description: "Usuário não encontrado"
 *       500:
 *         description: "Internal Server Error"
 */
userRoutes.delete("/user/:id", Auth.Authorization, userController.deleteUser);

export default userRoutes;
