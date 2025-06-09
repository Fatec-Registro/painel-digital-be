import express from "express";
import panelController from "./panelController.js";
// import Auth from "../../middleware/Auth.js"; descomentar quando for implementar autenticação

const panelRoutes = express.Router();

/**
 * @swagger
 * tags:
 * name: Panels
 * description: Operações relacionadas a Painéis
 */

// Endpoint: Consulta de todos os Painéis (GET /panels)
panelRoutes.get(
  "/panels",
  /* Auth.Authorization, */ panelController.getAllPanels
);
/**
 * @swagger
 * /panels:
 * get:
 * summary: Consultar todos os painéis
 * tags: [Panels]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de painéis retornada com sucesso
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * panels:
 * type: array
 * items:
 * $ref: '#/components/schemas/Panel'
 * 500:
 * description: Internal Server Error
 */

// Endpoint: Cadastro de um novo Painel (POST /panel)
panelRoutes.post(
  "/panel",
  /* Auth.Authorization, */ panelController.createPanel
);
/**
 * @swagger
 * /panel:
 * post:
 * summary: Cadastrar um novo painel
 * tags: [Panels]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Panel'
 * responses:
 * 201:
 * description: Painel criado com sucesso
 * 400:
 * description: Requisição inválida - erro de validação Zod
 * 500:
 * description: Internal Server Error
 */

// Endpoint: Deletar um Painel (DELETE /panel/:id)
panelRoutes.delete(
  "/panel/:id",
  /* Auth.Authorization, */ panelController.deletePanel
);
/**
 * @swagger
 * /panel/{id}:
 * delete:
 * summary: Deletar um painel específico
 * tags: [Panels]
 * security:
 * - bearerAuth: []
 * parameters:
 * -   name: id
 * in: path
 * required: true
 * description: O ID do painel a ser deletado
 * schema:
 * type: string
 * format: mongo-id
 * responses:
 * 204:
 * description: Apagado com sucesso (No Content)
 * 400:
 * description: Formato de ID inválido
 * 404:
 * description: Painel não encontrado
 * 500:
 * description: Internal Server Error
 */

// Endpoint: Atualizar um Painel (PATCH /panel/:id)
panelRoutes.patch(
  "/panel/:id",
  /* Auth.Authorization, */ panelController.updatePanel
);
/**
 * @swagger
 * /panel/{id}:
 * patch:
 * summary: Atualizar um painel específico (parcial)
 * tags: [Panels]
 * security:
 * - bearerAuth: []
 * parameters:
 * -   name: id
 * in: path
 * required: true
 * description: O ID do painel a ser atualizado
 * schema:
 * type: string
 * format: mongo-id
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Panel'
 * responses:
 * 200:
 * description: Atualizado com sucesso
 * 400:
 * description: Formato de ID inválido ou erro de validação
 * 404:
 * description: Painel não encontrado
 * 500:
 * description: Internal Server Error
 */

// Endpoint: Listar um painel específico (GET /panel/:id)
panelRoutes.get(
  "/panel/:id",
  /* Auth.Authorization, */ panelController.getOnePanel
);
/**
 * @swagger
 * /panel/{id}:
 * get:
 * summary: Consultar um painel específico
 * tags: [Panels]
 * security:
 * - bearerAuth: []
 * parameters:
 * -   name: id
 * in: path
 * required: true
 * description: O ID do painel a ser consultado
 * schema:
 * type: string
 * format: mongo-id
 * responses:
 * 200:
 * description: Painel retornado com sucesso
 * 400:
 * description: Formato de ID inválido
 * 404:
 * description: Painel não encontrado
 * 500:
 * description: Internal Server Error
 */

export default panelRoutes;
