import express from "express";
import exampleController from "./exampleController.js";
import Auth from "../../middleware/Auth.js";

const exampleRoutes = express.Router();

//Endpoint: Listar todos os Exemplos
exampleRoutes.get("/examples",  Auth.Authorization, exampleController.getAllExample);

//Endpoint: Cadastrar um novo Exemplo
exampleRoutes.post("/example", Auth.Authorization, exampleController.createExample);

//Endpoint: Deletar um Exemplo
exampleRoutes.delete("/example/:id", Auth.Authorization, exampleController.deleteExample);

//Endpoint: Atualizar um Exemplo
exampleRoutes.patch("/example/:id", Auth.Authorization, exampleController.updateExample);

//Endpoint: Listar um exemplo especifico
exampleRoutes.get("/example/:id", Auth.Authorization, exampleController.getOneExample);

export default exampleRoutes;