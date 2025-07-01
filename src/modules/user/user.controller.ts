import { Request, Response } from 'express';
import { createUserSchema, updateUserSchema } from "./user.dto";
import userService from "./user.service";
import mongoose from "mongoose";
import { ZodError } from "zod";

/**
 * @description Busca todos os usuários.
 */
const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userService.getAll();
        res.status(200).json({ users });
    } catch (error: unknown) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * @description Cria um novo usuário.
 */
const createUser = async (req: Request, res: Response): Promise<void> => {
    // Usar 'safeParse' é uma ótima prática pois não lança erro, permitindo controle.
    const validationResult = createUserSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({ message: "Validation error", details: validationResult.error.flatten() });
        return;
    }

    try {
        const novoUsuario = await userService.create(validationResult.data);
        // Exclui a senha do objeto de retorno
        const userResponse = JSON.parse(JSON.stringify(novoUsuario));
        delete userResponse.senha;

        res.status(201).json(userResponse);
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
            // Verifica se é o erro de e-mail duplicado que definimos no service
            if (error.message.includes("E-mail já cadastrado")) {
                res.status(409).json({ message: error.message }); // 409 Conflict
                return;
            }
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * @description Deleta um usuário pelo ID.
 */
const deleteUser = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid ID format" });
            return;
        }
        await userService.delete(id);
        res.sendStatus(204);
    } catch (error: unknown) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * @description Atualiza um usuário pelo ID.
 */
const updateUser = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid ID format" });
            return;
        }

        // 'parse' lança um erro se a validação falhar, que será pego pelo 'catch'
        const validatedData = updateUserSchema.parse(req.body);
        const user = await userService.update(id, validatedData);
        
        if (!user) {
            res.status(404).json({ message: "User not found" });
        } else {
            res.status(200).json(user);
        }
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ZodError) {
            res.status(400).json({ message: "Validation error", details: error.flatten() });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

/**
 * @description Busca um usuário pelo email.
 */
const getOneUser = async (req: Request<{ email: string }>, res: Response): Promise<void> => {
    try {
        const { email } = req.params;
        const user = await userService.getOne(email);
        if (!user) {
            res.status(404).json({ message: "User not found" });
        } else {
            // Exclui a senha do objeto de retorno
            const userResponse = JSON.parse(JSON.stringify(user));
            delete userResponse.senha;
            res.status(200).json(userResponse);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default { getAllUsers, createUser, deleteUser, updateUser, getOneUser };