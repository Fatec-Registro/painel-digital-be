import express from "express";
import authController from "./auth.controller.js";
import Auth from "../../middleware/Auth.js";

const authRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operações relacionadas a autenticação
 */

/**
 * @swagger
 * /auth/login:
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
 *         description: E-mail inválido ou senha não fornecida.
 *       401:
 *         description: Credenciais inválidas.
 *       404:
 *         description: E-mail não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
authRoutes.post("/auth/login", authController.loginUser);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Realiza a renovação do token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida
 *       403:
 *         description: Refresh token inválido
 */
authRoutes.post('/auth/refresh', authController.refreshToken);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Retorna dados do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida
 *       404:
 *         description: Usuário não encontrado
 */
authRoutes.get('/auth/me', Auth.Authorization, authController.me);

export default authRoutes;
