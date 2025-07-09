import { Request, Response } from "express";
import mongoose from "mongoose";
import userRequestService from "./userRequest.service.js";
import {
  createUserRequestSchema,
  updateUserRequestSchema,
} from "./userRequest.dto.js";
import { ZodError } from "zod";

/**
 * @description Busca todas as solicitações de usuário.
 */
const getAllRequests = async (req: Request, res: Response): Promise<void> => {
  const perfil = req.loggedUser?.perfil;
  const departamento = req.loggedUser?.departamento;
  try {
    let requests;
    if (perfil === "suporte" && departamento === "DTI") {
      // Suporte vê tudo
      requests = await userRequestService.getAll();
    } else {
      // Outros só veem as solicitações do próprio departamento
      requests = await userRequestService.getAllByDepartment(departamento!);
    }

    res.status(200).json({ requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @description Busca uma solicitação especifica pelo ID.
 */
const getRequestById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
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
  const validationResult = createUserRequestSchema.safeParse({
    ...req.body,
    criadoPor: req.loggedUser?.id,
  });

  if (!validationResult.success) {
    res.status(400).json({
      message: "Erro de validação",
      details: validationResult.error.flatten(),
    });
    return;
  }

  // Validação extra para departamentos/perfis
  const userPerfil = req.loggedUser?.perfil;
  const userDepartamento = req.loggedUser?.departamento;

  const solicitacaoPerfil = validationResult.data.perfil;
  const solicitacaoDepartamento = validationResult.data.departamento;

  if (
    (userPerfil !== "suporte" || userDepartamento !== "DTI") &&
    solicitacaoDepartamento !== userDepartamento
  ) {
    res.status(403).json({
      message:
        "Você só pode solicitar usuários para seu próprio departamento, exceto DTI.",
    });
    return;
  }

  try {
    const newRequest = await userRequestService.create(validationResult.data);

    const responseData = JSON.parse(JSON.stringify(newRequest));
    delete responseData.senhaTemporaria;

    res.status(201).json(responseData);
  } catch (error: unknown) {
    console.error(error);
    if (
      error instanceof Error &&
      error.message.includes("E-mail já cadastrado")
    ) {
      res.status(409).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Erro ao criar solicitação" });
  }
};

/**
 * @description Aprova uma solicitação pelo ID.
 */
const approveRequest = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const approverId = req.loggedUser?.id;
  const approverPerfil = req.loggedUser?.perfil;
  const approverDepartamento = req.loggedUser?.departamento;

  if (!approverId) {
    res.status(401).json({ message: "Usuário não autenticado" });
    return;
  }
  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(approverId)
  ) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }
  if (approverPerfil !== "suporte" || approverDepartamento !== "DTI") {
    res.status(403).json({
      message: "Você não tem permissão para aprovar ou rejeitar solicitações.",
    });
    return;
  }

  try {
    const approvedUser = await userRequestService.approveRequest(
      id,
      approverId
    );
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
const rejectRequest = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const approverId = req.loggedUser?.id;
  const approverPerfil = req.loggedUser?.perfil;
  const approverDepartamento = req.loggedUser?.departamento;

  if (!approverId) {
    res.status(401).json({ message: "Usuário não autenticado" });
    return;
  }
  if (approverPerfil !== "suporte" || approverDepartamento !== "DTI") {
    res.status(403).json({
      message: "Você não tem permissão para aprovar ou rejeitar solicitações.",
    });
    return;
  }
  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(approverId)
  ) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  try {
    const rejectedRequest = await userRequestService.rejectRequest(
      id,
      approverId
    );
    res.status(200).json(rejectedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao rejeitar solicitação" });
  }
};

/**
 * @description Deleta uma solicitação feita.
 */
const deleteRequest = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const userId = req.loggedUser?.id;
  const userDepartamento = req.loggedUser?.departamento;

  if (!userId) {
    res.status(401).json({ message: "Usuário não autenticado" });
    return;
  }
  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  try {
    const userRequest = await userRequestService.getOne(id);

    if (!userRequest) {
      res.status(404).json({ message: "Solicitação não encontrada" });
      return;
    }

    // Se não for DTI, o departamento da requisição deve ser igual ao do usuário
    if (
      userDepartamento !== "DTI" &&
      userRequest.departamento !== userDepartamento
    ) {
      res
        .status(403)
        .json({
          message: "Você só pode cancelar solicitações do seu departamento.",
        });
      return;
    }

    await userRequestService.deleteRequest(id, userId);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao cancelar solicitação" });
  }
};

export default {
  getAllRequests,
  getRequestById,
  createRequest,
  approveRequest,
  rejectRequest,
  deleteRequest,
};
