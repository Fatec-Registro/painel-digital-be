import { Request, Response } from "express";
import panelService from "./panel.service";
import { createPanelSchema } from "./panel.dto";
import mongoose from "mongoose";
import { ZodError } from "zod";

/**
 * @description Busca todos os painéis.
 */
const getAllPanels = async (req: Request, res: Response): Promise<void> => {
  try {
    const panels = await panelService.getAll();
    res.status(200).json({ panels });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @description Cria um novo painel.
 */
const createPanel = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = createPanelSchema.parse(req.body);
    const panel = await panelService.create(parsedData);
    res.status(201).json(panel);
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
 * @description Deleta um painel pelo ID.
 */
const deletePanel = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }
    const deletedPanel = await panelService.delete(id);
    if (!deletedPanel) {
      res.status(404).json({ message: "Not Found" });
    } else {
      res.sendStatus(204);
    }
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @description Atualiza um painel pelo ID.
 */
const updatePanel = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }
    const panel = await panelService.update(id, req.body);
    if (!panel) {
      res.status(404).json({ message: "Not Found" });
    } else {
      res.status(200).json(panel);
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
 * @description Busca um painel pelo seu ID.
 */
const getOnePanel = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }
    const panel = await panelService.getOne(id);
    if (!panel) {
      res.status(404).json({ message: "Not Found" });
    } else {
      res.status(200).json(panel);
    }
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default {
  getAllPanels,
  createPanel,
  deletePanel,
  updatePanel,
  getOnePanel,
};