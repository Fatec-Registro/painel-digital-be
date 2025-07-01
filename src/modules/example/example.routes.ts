import express from "express";
import exampleController from "./example.controller.js";
import Auth from "../../middleware/Auth.js";

const exampleRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Example
 *   description: Rotas de exemplo
 */

/**
 * @swagger
 * /examples:
 *   get:
 *     summary: Retorna todos os exemplos
 *     tags: [Example]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sucesso
 */
exampleRoutes.get("/examples", Auth.Authorization, exampleController.getAllExample);

/**
 * @swagger
 * /example:
 *   post:
 *     summary: Cria um novo exemplo
 *     tags: [Example]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Criado
 */
exampleRoutes.post("/example", Auth.Authorization, exampleController.createExample);

/**
 * @swagger
 * /example/{id}:
 *   delete:
 *     summary: Deleta um exemplo pelo ID
 *     tags: [Example]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deletado com sucesso
 */
exampleRoutes.delete("/example/:id", Auth.Authorization, exampleController.deleteExample);

/**
 * @swagger
 * /example/{id}:
 *   patch:
 *     summary: Atualiza um exemplo pelo ID
 *     tags: [Example]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Atualizado com sucesso
 */
exampleRoutes.patch("/example/:id", Auth.Authorization, exampleController.updateExample);

/**
 * @swagger
 * /example/{id}:
 *   get:
 *     summary: Retorna um exemplo pelo ID
 *     tags: [Example]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sucesso
 */
exampleRoutes.get("/example/:id", Auth.Authorization, exampleController.getOneExample);

export default exampleRoutes;
