import { createUserSchema, updateUserSchema } from './userDTO.js';
import User from './userModel.js';
import bcrypt from "bcrypt";

class userService {
    // Método para buscar todos os Usuários
    async getAll(){
        try{
            const users = await User.find().select('-password');
            return users;
        } catch (error) {
            console.log(error);
        }
    }
    // Método para cadastrar um novo Usuário
    async create(data){
        try{
            const validatedData = createUserSchema.parse(data);
            const existingUser = await User.findOne({ email: validatedData.email });
            if (existingUser) {
                throw { code: 11000, keyPattern: { email: true } };
            }
            const hashedPassword = await bcrypt.hash(validatedData.password, 10); //Gera Hash de Senha
            validatedData.password = hashedPassword; // Substitui a senha pelo hash criado
            const newUser = new User(validatedData);
            await newUser.save();
            return newUser;
        } catch (error) {
            console.log(error);
            throw error; // Deixa assim para o erro chegar completo no controller
        }
    }
    async delete(id){
        try{
            const user = await User.findByIdAndDelete(id);
            if (!user) {
                console.log(`Nenhum usuário com o ID: ${id} foi encontrado.`);
                return;
            }
            console.log(`Usuário com o ID: ${id} foi deletado.`);
        } catch(error) {
            console.log(error);
        }
    }

    async update(id, data) {
        try{
            const validatedData = updateUserSchema.parse(data);
            // Se o Update tiver password, criptografa ela antes de atualizar
            if(validatedData.password){
                const hashedPassword = await bcrypt.hash(validatedData.password, 10);
                validatedData.password = hashedPassword;
            }
            // Busca o usuário especifico
            const updateUser = await User.findByIdAndUpdate(id, validatedData, {
                new: true,
            });
            // Verifica se o usuário foi encontrado
            if (!updateUser){
                console.log(`Nenhum usuário com o ID: ${id} foi encontrado para atualização.`);
                return null;
            }
            // Mensagem de sucesso
            console.log(`Dados do usuário ${id} foram alterados com sucesso!`);
            return updateUser;
        } catch (error) {
            console.log(error);
            throw new Error("Erro na atualização do usuário: " + error.message); // Retorna o erro se falhar na atualização
        }
    }
    async getOne(email) {
        try {
        const user = await User.findOne({ email: email });
        return user;
        } catch (error) {
        console.log(error);
        }
    }
}
export default new userService();