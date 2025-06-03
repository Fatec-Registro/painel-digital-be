import express from "express";
import userController from "./userController.js";
import Auth from "../../middleware/Auth.js";

const userRoutes = express.Router();

//Endpoint: Listar todos os Usuários
userRoutes.get("/users", Auth.Authorization, userController.getAllUsers);

//Endpoint: Cadastrar novo usuário
userRoutes.post("/user", userController.createUser);

//Endpoint: Deletar um Usuário
userRoutes.delete("/user/:id", Auth.Authorization, userController.deleteUser);

//Endpoint: Atualizar um Usuário
userRoutes.patch("/user/:id", Auth.Authorization, userController.updateUser);

//Endpoint: Listar um Usuário especifico
userRoutes.get("/user/:email", Auth.Authorization, userController.getOneUser);

// Endpoint para Login do Usuário
userRoutes.post("/auth", userController.loginUser);

export default userRoutes;