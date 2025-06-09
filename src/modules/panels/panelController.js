import panelService from "./panelService.js";
import { createPanelSchema } from "./panelDTO.js";
import { ObjectId } from "mongodb";
import { ZodError } from "zod";

const getAllPanels = async (req, res) => {
  try {
    const panels = await panelService.getAll();
    return res.status(200).json({ panels: panels });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createPanel = async (req, res) => {
  try {
    const parsedData = createPanelSchema.parse(req.body);
    const panel = await panelService.create(parsedData);
    res.status(201).json({ panel });
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deletePanel = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const id = req.params.id;
      const deletedPanel = await panelService.delete(id);
      if (!deletedPanel) {
        return res.status(404).json({ error: "Not Found" });
      }
      res.sendStatus(204);
    } else {
      res.status(400).json({ error: "Invalid ID format" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updatePanel = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const panel = await panelService.update(id, req.body);
    if (!panel) {
      return res.status(404).json({ error: "Not Found" });
    }
    return res.status(200).json({ panel });
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOnePanel = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const id = req.params.id;
      const panel = await panelService.getOne(id);
      if (!panel) {
        res.status(404).json({ error: "Not Found" });
      } else {
        res.status(200).json({ panel });
      }
    } else {
      res.status(400).json({ error: "Invalid ID format" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  getAllPanels,
  createPanel,
  deletePanel,
  updatePanel,
  getOnePanel,
};
