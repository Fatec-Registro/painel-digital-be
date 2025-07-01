import { CreateUserDTO, UpdateUserDTO, createUserSchema, updateUserSchema } from './user.dto';
import User, { IUser } from './user.model';
import { ZodError } from 'zod';

class UserService {
    /**
     * Busca todos os usuários, excluindo o campo de senha do retorno.
     * @returns Uma promessa que resolve para um array de documentos IUser.
     */
    async getAll(): Promise<IUser[]> {
        try {
            const users = await User.find().select('-senha');
            return users;
        } catch (error) {
            console.error("Erro ao buscar todos os usuários:", error);
            throw new Error("Falha ao buscar usuários.");
        }
    }

    /**
     * Cria um novo usuário após validação.
     * @param data - Os dados para o novo usuário, conforme o CreateUserDTO.
     * @returns Uma promessa que resolve para o novo documento IUser criado.
     */
    async create(data: CreateUserDTO): Promise<IUser> {
        try {
            const validatedData = createUserSchema.parse(data);
            
            const existingUser = await User.findOne({ email: validatedData.email });
            if (existingUser) {
                // Lança um erro que pode ser tratado como conflito (409) no controller.
                throw new Error("E-mail já cadastrado.");
            }

            const newUser = new User(validatedData);
            await newUser.save();
            return newUser;
        } catch (error) {
            if (error instanceof ZodError) {
                console.error("Erro de validação Zod:", error.errors);
                throw new Error(`Dados inválidos: ${error.errors.map(e => e.message).join(', ')}`);
            }
            console.error("Erro na criação de um novo usuário:", error);
            // Relança o erro para ser tratado pela camada superior (controller).
            throw error; 
        }
    }

    /**
     * Deleta um usuário pelo seu ID.
     * @param id - O ID do usuário a ser deletado.
     */
    async delete(id: string): Promise<void> {
        try {
            const user = await User.findByIdAndDelete(id);
            if (!user) {
                console.log(`Nenhum usuário com o ID: ${id} foi encontrado.`);
                return;
            }
            console.log(`Usuário com o ID: ${id} foi deletado com sucesso!`);
        } catch(error) {
            console.error(`Erro ao deletar o usuário ${id}:`, error);
            throw new Error("Falha ao deletar o usuário.");
        }
    }

    /**
     * Atualiza um usuário.
     * @param id - O ID do usuário a ser atualizado.
     * @param data - Os dados para atualização, conforme o UpdateUserDTO.
     * @returns Uma promessa que resolve para o documento IUser atualizado, ou null se não encontrado.
     */
    async update(id: string, data: UpdateUserDTO): Promise<IUser | null> {
        try {
            const validatedData = updateUserSchema.parse(data);

            const updatedUser = await User.findByIdAndUpdate(id, validatedData, {
                new: true, // Retorna o documento modificado
            }).select('-senha');

            if (!updatedUser) {
                console.log(`Nenhum usuário com o ID: ${id} foi encontrado para atualização.`);
                return null;
            }

            console.log(`Dados do usuário ${id} foram alterados com sucesso!`);
            return updatedUser;
        } catch (error) {
            console.error(`Erro ao atualizar o usuário ${id}:`, error);
            if (error instanceof ZodError) {
                throw new Error(`Dados inválidos: ${error.errors.map(e => e.message).join(', ')}`);
            }
            throw new Error("Erro na atualização do usuário."); 
        }
    }

    /**
     * Busca um único usuário pelo seu e-mail.
     * @param email - O e-mail do usuário.
     * @returns Uma promessa que resolve para o documento IUser, ou null se não for encontrado.
     */
    async getOne(email: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ email: email });
            return user;
        } catch (error) {
            console.error(`Erro ao buscar o usuário com email ${email}:`, error);
            throw new Error("Falha ao buscar o usuário.");
        }
    }
}

export default new UserService();