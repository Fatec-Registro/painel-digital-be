import { Request, Response } from 'express';
import exampleService from "./example.service.js";
import { ZodError } from "zod";
import mongoose from 'mongoose';

/**
 * @description Busca todos os exemplos.
 */
const getAllExample = async (req: Request, res: Response): Promise<void> => {
    try {
        const examples = await exampleService.getAll();
        res.status(200).json({ examples });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * @description Cria um novo exemplo.
 */
const createExample = async (req: Request, res: Response): Promise<void> => {
    try {
        const example = await exampleService.create(req.body);
        res.status(201).json({ example });
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ZodError) {
            res.status(400).json({ message: "Validation error", details: error.errors });
        } else if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

/**
 * @description Deleta um exemplo pelo ID.
 */
const deleteExample = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid ID format" });
            return;
        }
        await exampleService.delete(id);
        res.sendStatus(204);
    } catch (error: unknown) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * @description Atualiza um exemplo pelo ID.
 */
const updateExample = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid ID format" });
            return;
        }
        
        const example = await exampleService.update(id, req.body);

        if (!example) {
            res.status(404).json({ message: "Example not found" });
        } else {
            res.status(200).json({ example });
        }
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ZodError) {
            res.status(400).json({ message: "Validation error", details: error.errors });
        } else if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

/**
 * @description Busca um único exemplo pelo ID.
 */
const getOneExample = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid ID format" });
            return;
        }

        const example = await exampleService.getOne(id);

        if (!example) {
            res.status(404).json({ message: "Example not found" });
        } else {
            res.status(200).json({ example });
        }
    } catch (error: unknown) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default { getAllExample, createExample, deleteExample, updateExample, getOneExample };