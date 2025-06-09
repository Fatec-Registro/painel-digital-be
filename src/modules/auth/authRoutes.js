import express from "express";
import authController from "./authController.js";
import Auth from "../../middleware/Auth.js";

const authRoutes = express.Router();

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Operações relacionadas a autenticação
 */

// Endpoint para Login do Usuário
authRoutes.post("/auth/login", authController.loginUser);
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
 *         description: E-mail invalid or E-mail not found.
 *       401:
 *         description: Credential invalid.
 *       404:
 *         description: E-mail não encontrado
 *       500:
 *         description: Internal Server Error
 */


// Endpoint para Refresh do token
authRoutes.post('/auth/refresh', authController.refreshToken);
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Realiza a renovação do token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
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
 *         description: Refresh token not found
 *       403:
 *         description: Refresh token invalid
 *       500:
 *         description: Internal Server Error
 */


// Endpoint para Informações do user referente ao token
authRoutes.get('/auth/me', Auth.Authorization, authController.me);
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "68462152b28112df68c87ea3"
 *                 email:
 *                   type: string
 *                   example: "vinicius@gmail.com"
 *       404:
 *         description: User not Found
 *       401:
 *         description: Token not provided or expired
 *       403:
 *         description: Refresh token invalid
 *       500:
 *         description: Internal Server Error
 */

export default authRoutes;