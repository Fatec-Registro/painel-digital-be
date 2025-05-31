import Example from "./exampleModel.js";
import { createExampleSchema, updateExampleSchema } from "./exampleDTO.js";

class exampleService {
    // Método para a busca de todos os Exemplos
    async getAll(){
        try{
            const examples = await Example.find();
            return examples;
        } catch (error) {
            console.log(error);
        }
    }
    // Método para criação de um novo exemplo
    async create(data){
        try {
            const validatedData = createExampleSchema.parse(data);
            const newExample = new Example(validatedData);
            await newExample.save();
            return newExample;
        } catch (error) {
            console.log(error);
            throw new Error("Erro na criação de um novo Exemplo: " + error.message);
        }
    }
    // Método para Deletar um exemplo de acordo com o ID
    async delete(id){
        try{
            const example = await Example.findByIdAndDelete(id);
            if(!example){
                console.log(`Nenhum Exemplo com o ID: ${id} foi encontrado.`);
                return;
            }
            console.log(`Exemplo ${id} foi deletado com sucesso!`);
        }catch(error){
            console.log(error);
        }
    }
    // Método para Atualizar um exemplo de acordo com o ID
    async update(id, data){
        try{
            const validatedData = updateExampleSchema.parse(data);
            const updateExample = await Example.findByIdAndUpdate(
                id,
                validatedData,
                { new: true }
            );
            if (!updateExample){
                console.log(`Nenhum exemplo com o ID: ${id} foi encontrado para a atualização.`);
                return null;
            }
            console.log(`Dados do exemplo com o ID: ${id} foram atualizados com sucesso!`);
            return updateExample;
        } catch (error) {
            console.log(error);
            throw new Error("Erro na atualização dos dados de exemplo: " + error.message);
        }
    }
    // Método para Listar um único Exemplo
    async getOne(id){
        try{
            const example = await Example.findOne({_id: id})
            return example
        } catch (error) {
            console.log(error)
        }
    }

}

export default new exampleService();