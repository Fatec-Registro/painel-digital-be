import { createUserSchema, updateUserSchema } from './userDTO.js';
import User from './userModel.js';
import bcrypt from "bcrypt";

class userService {
    async getAll(){
        try{
            const users = await User.find().select('-senha');
            return users;
        } catch (error) {
            console.log(error);
        }
    }

    async create(data){
        try{
            const validatedData = createUserSchema.parse(data);
            const existingUser = await User.findOne({ email: validatedData.email });
            if (existingUser) {
                throw { code: 11000, keyPattern: { email: true } };
            }
            const newUser = new User(validatedData);
            await newUser.save();
            return newUser;
        } catch (error) {
            console.log(error);
            throw error; 
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
            const updateUser = await User.findByIdAndUpdate(id, validatedData, {
                new: true,
            });
            if (!updateUser){
                console.log(`Nenhum usuário com o ID: ${id} foi encontrado para atualização.`);
                return null;
            }
            console.log(`Dados do usuário ${id} foram alterados com sucesso!`);
            return updateUser;
        } catch (error) {
            console.log(error);
            throw new Error("Erro na atualização do usuário: " + error.message); 
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
