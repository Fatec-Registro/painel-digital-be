import express from "express";
import exampleController from "./exampleController.js";

const exampleRoutes = express.Router();

//Endpoint: Listar todos os Exemplos
exampleRoutes.get("/examples", exampleController.getAllExample);

//Endpoint: Cadastrar um novo Exemplo
exampleRoutes.post("/example", exampleController.createExample);

//Endpoint: Deletar um Exemplo
exampleRoutes.delete("/example/:id", exampleController.deleteExample);

//Endpoint: Atualizar um Exemplo
exampleRoutes.patch("/example/:id", exampleController.updateExample);

//Endpoint: Listar um exemplo especifico
exampleRoutes.get("/example/:id", exampleController.getOneExample);

export default exampleRoutes;