import express from "express";
import panelController from "./panel.controller.js";
import Auth from "../../middleware/Auth.js";

const panelRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Panels
 *   description: Operações relacionadas a Painéis
 */

/**
 * @swagger
 * /panels:
 *   get:
 *     summary: Consultar todos os painéis
 *     tags: [Panels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sucesso
 */
panelRoutes.get("/panels", Auth.Authorization, panelController.getAllPanels);

/**
 * @swagger
 * /panel:
 *   post:
 *     summary: Cadastrar um novo painel
 *     tags: [Panels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Criado
 */
panelRoutes.post("/panel", Auth.Authorization, panelController.createPanel);

/**
 * @swagger
 * /panel/{id}:
 *   get:
 *     summary: Consultar um painel específico
 *     tags: [Panels]
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
panelRoutes.get("/panel/:id", Auth.Authorization, panelController.getOnePanel);

/**
 * @swagger
 * /panel/{id}:
 *   delete:
 *     summary: Deletar um painel específico
 *     tags: [Panels]
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
panelRoutes.delete("/panel/:id", Auth.Authorization, panelController.deletePanel);

/**
 * @swagger
 * /panel/{id}:
 *   patch:
 *     summary: Atualizar um painel específico
 *     tags: [Panels]
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
panelRoutes.patch("/panel/:id", Auth.Authorization, panelController.updatePanel);

export default panelRoutes;
