import express from "express";
import userController from "./userController.js";
import Auth from "../../middleware/Auth.js";

const userRoutes = express.Router();

/**
 * @swagger
 * tags:
 *  name: User
 *  description: Operações relacionadas a User
 */

//Endpoint: Listar todos os Usuários
userRoutes.get("/users", Auth.Authorization, userController.getAllUsers);
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Consultar todos os usuários
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *          description: Ok
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                              _id:
 *                                  type: string
 *                                  example: "683e79febcfc8bf39a80d13a"
 *                              email:
 *                                  type: string
 *                                  example: "vincius@gmail.com"
 *       401:
 *          description: invalid Token
 *       500:
 *          description: Internal Server Error
 * 
 */


//Endpoint: Cadastrar novo usuário
userRoutes.post("/user", userController.createUser);
/**
 * @swagger
 * /user:
 *   post:
 *     summary: Cadastrar um novo usuário
 *     tags: [User]
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      email:
 *                          type: string
 *                          example: "vincius@gmail.com"
 *                      password:
 *                          type: number
 *                          example: "12345"
 *     responses:
 *       201:
 *          description: Created
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                              _id:
 *                                  type: string
 *                                  example: "683e79febcfc8bf39a80d13a"
 *                              email:
 *                                  type: string
 *                                  example: "vincius@gmail.com"
 *       400:
 *          description: Email já cadastrado or Requisição inválida - erro de validação
 *       500:
 *          description: Internal Server Error
 */


//Endpoint: Deletar um Usuário
userRoutes.delete("/user/:id", Auth.Authorization, userController.deleteUser);
/**
 * @swagger
 * /user/:id:
 *   delete:
 *     summary: Deletar um usuário especifico
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters: 
 *       -   name: id,
 *           in: path,
 *           required: true,
 *           schema:
 *               type: string,
 *               format: mongo-id,
 *               example: 60c72b2f9b1d4c3a5c8e4a2b
 *     responses:
 *       204:
 *          description: No content
 *       400:
 *          description: Bad Request
 *       401:
 *          description: invalid Token
 *       500:
 *          description: Internal Server Error
 */


//Endpoint: Atualizar um Usuário
userRoutes.patch("/user/:id", Auth.Authorization, userController.updateUser);
/**
 * @swagger
 * /user/:id:
 *   patch:
 *     summary: Atualizar um usuário especifico
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters: 
 *       -   name: id
 *           in: path
 *           required: true
 *           schema:
 *               type: string,
 *               format: mongo-id,
 *               example: 60c72b2f9b1d4c3a5c8e4a2b
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      emial:
 *                          type: string
 *                          example: "vinicius@gmail.com"
 *                      password:
 *                          type: number
 *                          example: 123456
 *     responses:
 *       200:
 *          description: OK
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          _id:
 *                              type: string
 *                              example: "683e79febcfc8bf39a80d13a"
 *                          email:
 *                              type: string
 *                              example: "vinicius@gmail.com"
 *       404:
 *          description: Not Found
 *       400:
 *          description: Invalid ID format or Requisição inválida - erro de validação
 *       401:
 *          description: invalid Token
 *       500:
 *          description: Internal Server Error
 */


//Endpoint: Listar um Usuário especifico
userRoutes.get("/user/:email", Auth.Authorization, userController.getOneUser);
/**
 * @swagger
 * /user/:email:
 *   get:
 *     summary: Consultar um usuário especifico
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters: 
 *       -   name: email
 *           in: path
 *           required: true
 *           schema:
 *               type: string,
 *               example: vincius@gmail.com
 *     responses:
 *       200:
 *          description: OK
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          _id:
 *                              type: string
 *                              example: "683e79febcfc8bf39a80d13a"
 *                          email:
 *                              type: string
 *                              example: "vincius@gmail.com"
 *       404:
 *          description: Not Found
 *       400:
 *          description: Bad Request
 *       401:
 *          description: invalid Token
 *       500:
 *          description: Internal Server Error
 */


// Sessão destinada ao login
/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Operações relacionadas a autenticação
 */

// Endpoint para Login do Usuário
userRoutes.post("/auth", userController.loginUser);
/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Realiza a autenticação do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: vinicius@email.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: E-mail inválido ou falha interna na geração do token
 *       401:
 *         description: Credenciais inválidas (senha incorreta)
 *       404:
 *         description: E-mail não encontrado
 *       500:
 *         description: Erro interno no servidor
 */


export default userRoutes;