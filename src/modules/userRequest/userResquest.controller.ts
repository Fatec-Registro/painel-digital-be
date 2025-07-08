import { Request, Response } from "express";
import mongoose from "mongoose";
import userRequestService from "./userRequest.service.js";
import { createUserRequestSchema, updateUserRequestSchema } from "./userRequest.dto.js";
import { ZodError } from "zod";

/**
 * @description Busca todas as solicitações de usuário.
 */
const getAllRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const requests = await userRequestService.getAll();
    res.status(200).json({ requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @description Busca uma solicitação pelo ID.
 */
const getRequestById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  try {
    const request = await userRequestService.getOne(id);
    if (!request) {
      res.status(404).json({ message: "Solicitação não encontrada" });
    } else {
      res.status(200).json(request);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar solicitação" });
  }
};

/**
 * @description Cria uma nova solicitação de usuário.
 */
const createRequest = async (req: Request, res: Response): Promise<void> => {
  // Injeta o ID do usuário autenticado no corpo da requisição
  const validationResult = createUserRequestSchema.safeParse({
    ...req.body,
    criadoPor: req.loggedUser?.id, // <- injeta aqui
  });

  if (!validationResult.success) {
    res.status(400).json({ message: "Erro de validação", details: validationResult.error.flatten() });
    return;
  }

  try {
    const newRequest = await userRequestService.create(validationResult.data);
    
    // Remove senha temporária do retorno
    const responseData = JSON.parse(JSON.stringify(newRequest));
    delete responseData.senhaTemporaria;

    res.status(201).json(responseData);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error && error.message.includes("E-mail já cadastrado")) {
      res.status(409).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Erro ao criar solicitação" });
  }
};

/**
 * @description Deleta uma solicitação pelo ID.
 */
const deleteRequest = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  try {
    await userRequestService.delete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao deletar solicitação" });
  }
};

/**
 * @description Aprova uma solicitação pelo ID.
 */
const approveRequest = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;
  const approverId = req.loggedUser?.id; // Presumindo que você tem o id do aprovador no req.user

  if (!approverId) {
    res.status(401).json({ message: "Usuário não autenticado" });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(approverId)) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  try {
    const approvedUser = await userRequestService.approveRequest(id, approverId);
    // Retorna o usuário criado, sem senha
    const userResponse = JSON.parse(JSON.stringify(approvedUser));
    delete userResponse.senha;

    res.status(200).json(userResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao aprovar solicitação" });
  }
};

/**
 * @description Rejeita uma solicitação pelo ID.
 */
const rejectRequest = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;
  const approverId = req.loggedUser?.id;

  if (!approverId) {
    res.status(401).json({ message: "Usuário não autenticado" });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(approverId)) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  try {
    const rejectedRequest = await userRequestService.rejectRequest(id, approverId);
    res.status(200).json(rejectedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao rejeitar solicitação" });
  }
};

/**
 * @description Cancela uma solicitação feita pelo próprio usuário.
 */
const cancelRequest = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.loggedUser?.id;

  if (!userId) {
    res.status(401).json({ message: "Usuário não autenticado" });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  try {
    await userRequestService.cancelRequest(id, userId);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao cancelar solicitação" });
  }
};

export default {  getAllRequests,  getRequestById,  createRequest,  deleteRequest,  approveRequest,  rejectRequest,  cancelRequest};
