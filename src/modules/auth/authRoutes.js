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
 *         description: E-mail inválido ou falha interna na geração do token
 *       401:
 *         description: Credenciais inválidas (senha incorreta)
 *       404:
 *         description: E-mail não encontrado
 *       500:
 *         description: Erro interno no servidor
 */

authRoutes.post('/auth/refresh', authController.refreshToken);
authRoutes.get('/auth/me', Auth.Authorization, authController.me);


export default authRoutes;