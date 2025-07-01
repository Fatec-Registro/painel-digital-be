import { Request, Response } from 'express';
import exampleService from "./example.service";
import { ZodError } from "zod";
import mongoose from 'mongoose';

/**
 * @description Busca todos os exemplos.
 * @param {Request} req O objeto de requisição do Express.
 * @param {Response} res O objeto de resposta do Express.
 */
const getAllExample = async (req: Request, res: Response): Promise<Response> => {
    try {
        const examples = await exampleService.getAll();
        return res.status(200).json({ examples }); // Cód. 200 (OK)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" }); // Cód. 500
    }
};

/**
 * @description Cria um novo exemplo.
 * @param {Request} req O objeto de requisição do Express, com os dados no body.
 * @param {Response} res O objeto de resposta do Express.
 */
const createExample = async (req: Request, res: Response): Promise<Response> => {
    try {
        // A validação e criação agora são responsabilidade do Service.
        // O service já usa o DTO para validar.
        const example = await exampleService.create(req.body);
        return res.status(201).json({ example }); // Cód. 201 (Created)
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ZodError) {
            return res.status(400).json({ message: "Validation error", details: error.errors }); // Cód. 400
        }
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error" }); // Cód. 500
    }
};

/**
 * @description Deleta um exemplo pelo ID.
 * @param {Request<{id: string}>} req O objeto de requisição do Express com o ID nos parâmetros.
 * @param {Response} res O objeto de resposta do Express.
 */
const deleteExample = async (req: Request<{ id: string }>, res: Response): Promise<Response | void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" }); // Cód. 400
        }
        await exampleService.delete(id);
        return res.sendStatus(204); // Cód. 204 (No Content)
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" }); // Cód. 500
    }
};

/**
 * @description Atualiza um exemplo pelo ID.
 * @param {Request<{id: string}>} req O objeto de requisição do Express com o ID e dados.
 * @param {Response} res O objeto de resposta do Express.
 */
const updateExample = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" }); // Cód. 400
        }
        
        const example = await exampleService.update(id, req.body);

        if (!example) {
            return res.status(404).json({ message: "Example not found" });  // Cód. 404
        }
        return res.status(200).json({ example }); // Cód. 200 (OK)
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ZodError) {
            return res.status(400).json({ message: "Validation error", details: error.errors }); // Cód. 400
        }
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error" });  // Cód. 500
    }
};

/**
 * @description Busca um único exemplo pelo ID.
 * @param {Request<{id: string}>} req O objeto de requisição do Express com o ID nos parâmetros.
 * @param {Response} res O objeto de resposta do Express.
 */
const getOneExample = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" }); // Cód. 400
        }

        const example = await exampleService.getOne(id);

        if (!example) {
            return res.status(404).json({ message: "Example not found" }); // Cód. 404
        }
        
        return res.status(200).json({ example }); // Cód. 200 (OK)
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" }); // Cód. 500
    }
};

export default { getAllExample, createExample, deleteExample, updateExample, getOneExample };