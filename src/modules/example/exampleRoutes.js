import express from "express";
import exampleController from "./exampleController.js";
import Auth from "../../middleware/Auth.js";

const exampleRoutes = express.Router();

/**
 * @swagger
 * tags:
 *  name: Example
 *  description: Operações relacionadas a exemplos
 */

// Endpoint: Consulta de todos os Exemplos
exampleRoutes.get("/examples",  Auth.Authorization, exampleController.getAllExample);
/**
 * @swagger
 * /examples:
 *   get:
 *     summary: Consultar todos os exemplos
 *     tags: [Example]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *          description: Lista de exemplos retornada com sucesso
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
 *                              name:
 *                                  type: string
 *                                  example: "Vinicius Souza"
 *                              age:
 *                                  type: number
 *                                  example: 20
 *                              typeUser:
 *                                  type: string
 *                                  example: "Suporte"
 *                              address:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          country:
 *                                              type: string
 *                                              example: "Brasil"
 *                                          state:
 *                                              type: string
 *                                              example: "São Paulo"
 *                                          city:
 *                                              type: string
 *                                              example: "Registro"
 *                                          district:
 *                                              type: string
 *                                              example: "Centro"
 *       500:
 *          description: Internal Server Error
 */


//Endpoint: Cadastro de um novo Exemplo
exampleRoutes.post("/example", Auth.Authorization, exampleController.createExample);
/**
 * @swagger
 * /example:
 *   post:
 *     summary: Cadastrar um novo exemplo
 *     tags: [Example]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: "Vinicius Souza"
 *                      age:
 *                          type: number
 *                          example: 20
 *                      typeUser:
 *                          type: string
 *                          example: "Suporte"
 *                      address:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  country:
 *                                      type: string
 *                                      example: "Brasil"
 *                                  state:
 *                                      type: string
 *                                      example: "São Paulo"
 *                                  city:
 *                                      type: string
 *                                      example: "Registro"
 *                                  district:
 *                                      type: string
 *                                      example: "Centro"
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
 *                              name:
 *                                  type: string
 *                                  example: "Vinicius Souza"
 *                              age:
 *                                  type: number
 *                                  example: 20
 *                              typeUser:
 *                                  type: string
 *                                  example: "Suporte"
 *                              address:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          country:
 *                                              type: string
 *                                              example: "Brasil"
 *                                          state:
 *                                              type: string
 *                                              example: "São Paulo"
 *                                          city:
 *                                              type: string
 *                                              example: "Registro"
 *                                          district:
 *                                              type: string
 *                                              example: "Centro"
 *       400:
 *          description: Requisição inválida - erro de validação
 *       500:
 *          description: Internal Server Error
 */


//Endpoint: Deletar um Exemplo
exampleRoutes.delete("/example/:id", Auth.Authorization, exampleController.deleteExample);
/**
 * @swagger
 * /example/:id:
 *   delete:
 *     summary: Deletar um exemplo especifico
 *     tags: [Example]
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
 *       500:
 *          description: Internal Server Error
 */


//Endpoint: Atualizar um Exemplo
exampleRoutes.patch("/example/:id", Auth.Authorization, exampleController.updateExample);
/**
 * @swagger
 * /example/:id:
 *   patch:
 *     summary: Atualizar um exemplo especifico
 *     tags: [Example]
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
 *                      name:
 *                          type: string
 *                          example: "Vinicius"
 *                      age:
 *                          type: number
 *                          example: 20
 *                      typeUser:
 *                          type: string
 *                          example: "Suporte"
 *                      address:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  country:
 *                                      type: string
 *                                      example: "Brasil"
 *                                  state:
 *                                      type: string
 *                                      example: "São Paulo"
 *                                  city:
 *                                      type: string
 *                                      example: "Registro"
 *                                  district:
 *                                      type: string
 *                                      example: "Centro"
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
 *                          name:
 *                              type: string
 *                              example: "Vinicius"
 *                          age:
 *                              type: number
 *                              example: 20
 *                          typeUser:
 *                              type: string
 *                              example: "Suporte"
 *                          address:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      country:
 *                                          type: string
 *                                          example: "Brasil"
 *                                      state:
 *                                          type: string
 *                                          example: "São Paulo"
 *                                      city:
 *                                          type: string
 *                                          example: "Registro"
 *                                      district:
 *                                          type: string
 *                                          example: "Centro"
 *       404:
 *          description: Not Found
 *       400:
 *          description: Invalid ID format or Requisição inválida - erro de validação
 *       500:
 *          description: Internal Server Error
 */


//Endpoint: Listar um exemplo especifico
exampleRoutes.get("/example/:id", Auth.Authorization, exampleController.getOneExample);
/**
 * @swagger
 * /example/:id:
 *   get:
 *     summary: Consultar um exemplo especifico
 *     tags: [Example]
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
 *                          name:
 *                              type: string
 *                              example: "Vinicius"
 *                          age:
 *                              type: number
 *                              example: 20
 *                          typeUser:
 *                              type: string
 *                              example: "Suporte"
 *                          address:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      country:
 *                                          type: string
 *                                          example: "Brasil"
 *                                      state:
 *                                          type: string
 *                                          example: "São Paulo"
 *                                      city:
 *                                          type: string
 *                                          example: "Registro"
 *                                      district:
 *                                          type: string
 *                                          example: "Centro"
 *       404:
 *          description: Not Found
 *       400:
 *          description: Bad Request
 *       500:
 *          description: Internal Server Error
 */
export default exampleRoutes;