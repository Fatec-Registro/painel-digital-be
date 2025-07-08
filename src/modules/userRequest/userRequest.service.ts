import { 
  CreateUserRequestDTO, 
  UpdateUserRequestDTO, 
  createUserRequestSchema, 
  updateUserRequestSchema 
} from './userRequest.dto.js';
import UserRequest, { IUserRequest } from './userRequest.model.js';
import User from '../user/user.model.js';
import { IUser } from '../user/user.model.js';
import { ZodError } from 'zod';
import mongoose from 'mongoose';


class UserRequestSerice {
    /**
     * Busca todos os usuários, excluindo o campo de senha do retorno.
     * @returns Uma promessa que resolve para um array de documentos IUserRequest.
     */
    async getAll(): Promise<IUserRequest[]> {
        try {
            const usersrequests = await UserRequest.find().select('-senha');
            return usersrequests;
        } catch (error) {
            console.error("Erro ao buscar todas as solicitações de criação de usuários: ", error);
            throw new Error("Falha ao buscar solicitações.");
        }
    }
    
    /**
     * Busca uma única solicitação de criação de usuário por ID.
     * @param id - O ID da solicitação.
     * @returns Uma promessa que resolve para o documento IUserRequest, ou null se não encontrado.
     */
    async getOne(id: string): Promise<IUserRequest | null> {
        try {
            const request = await UserRequest.findById(id).select('-senha');
            return request;
        } catch (error) {
            console.error(`Erro ao buscar a solicitação com ID ${id}:`, error);
            throw new Error("Falha ao buscar a solicitação.");
        }
    }

    /**
     * Cria uma nova solicitação após validação.
     * @param data - Os dados para nova solicitação, conforme o CreateUserRequestDTO.
     * @returns Uma promessa que resolve para o novo documento IUserRequest criado.
     */
      async create(data: CreateUserRequestDTO): Promise<IUserRequest> {
          try {
              const validatedData = createUserRequestSchema.parse(data);
              
              // Busca uma solicitação existente com o mesmo email que NÃO esteja rejeitada
              const existingUserRequest = await UserRequest.findOne({ 
                  email: validatedData.email,
                  status: { $ne: 'rejeitado' }
              });

              if (existingUserRequest) {
                  throw new Error("Já existe uma solicitação pendente ou aprovada com este e-mail.");
              }

              const newUserRequest = new UserRequest(validatedData);
              await newUserRequest.save();
              return newUserRequest;
          } catch (error) {
              if (error instanceof ZodError) {
                  console.error("Erro de validação Zod:", error.errors);
                  throw new Error(`Dados inválidos: ${error.errors.map(e => e.message).join(', ')}`);
              }
              console.error("Erro na criação de uma nova solicitação de criação de usuário:", error);
              throw error; 
          }
      }


    /**
     * Deleta uma solicitação pelo seu ID.
     * @param id - O ID da solicitação a ser deletado.
     */
    async delete(id: string): Promise<void> {
        try {
        const result = await UserRequest.findByIdAndDelete(id);
        if (!result) {
            console.log(`Nenhuma solicitação com ID: ${id} encontrada.`);
            return;
        }
        console.log(`Solicitação com ID: ${id} deletada com sucesso.`);
        } catch (error) {
        console.error(`Erro ao deletar solicitação ${id}:`, error);
        throw new Error("Falha ao deletar solicitação.");
        }
    }

  async approveRequest(id: string, approverId: string): Promise<IUser> {
    try {
      const req = await UserRequest.findById(id);
      if (!req || req.status !== 'pendente') {
        throw new Error("Solicitação inválida ou já processada.");
      }
      const userRequest = req as IUserRequest;

      const user = await User.create({
        nome: userRequest.nome,
        email: userRequest.email,
        perfil: userRequest.perfil,
        departamento: userRequest.departamento,
        senha: userRequest.senhaTemporaria,
        criadoPor: new mongoose.Types.ObjectId(approverId),
        dataCriacao: new Date(),
        ativo: true
      });

        userRequest.status = 'aprovado';
        userRequest.analisadoPor = new mongoose.Types.ObjectId(approverId); // ← conversão correta
        userRequest.dataDecisao = new Date();
        await userRequest.save();

        return user;
        } catch (error) {
            console.error("Erro ao aprovar solicitação:", error);
            throw new Error("Falha ao aprovar solicitação.");
        }
    }

    async rejectRequest(id: string, approverId: string): Promise<IUserRequest> {
    try {
      const req = await UserRequest.findById(id);
      if (!req || req.status !== 'pendente') {
        throw new Error("Solicitação inválida para rejeição.");
      }

      req.status = 'rejeitado';
      req.analisadoPor = new mongoose.Types.ObjectId(approverId);
      req.dataDecisao = new Date();
      await req.save();

      return req;
    } catch (error) {
      console.error("Erro ao rejeitar solicitação:", error);
      throw new Error("Falha ao rejeitar solicitação.");
    }
  }

  async cancelRequest(id: string, userId: string): Promise<boolean> {
    try {
      const req = await UserRequest.findOne({ _id: id, criadoPor: userId, status: 'pendente' });
      if (!req) {
        throw new Error("Solicitação não encontrada ou já processada.");
      }
      await req.deleteOne();
      return true;
    } catch (error) {
      console.error("Erro ao cancelar solicitação:", error);
      throw new Error("Falha ao cancelar solicitação.");
    }
  }

}

export default new UserRequestSerice();