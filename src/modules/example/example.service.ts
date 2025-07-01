import Example, {IExample }  from "./example.model"; 
import { 
    createExampleSchema, 
    updateExampleSchema,
    CreateExampleDTO, 
    UpdateExampleDTO  
} from "./example.dto";
import { ZodError } from "zod";

class ExampleService {
    /**
     * Busca todos os documentos Example no banco de dados.
     * @returns Uma promessa que resolve para um array de documentos IExample.
     */
    async getAll(): Promise<IExample[]> {
        try {
            const examples = await Example.find();
            return examples;
        } catch (error) {
            console.error("Erro ao buscar todos os Exemplos:", error);
            throw new Error("Falha ao buscar exemplos.");
        }
    }

    /**
     * Cria um novo documento Example.
     * @param data - Os dados para o novo exemplo, conforme o CreateExampleDTO.
     * @returns Uma promessa que resolve para o novo documento IExample criado.
     */
    async create(data: CreateExampleDTO): Promise<IExample> {
        try {
            // A validação do Zod já garante que os dados estão no formato correto
            const validatedData = createExampleSchema.parse(data);
            const newExample = new Example(validatedData);
            await newExample.save();
            return newExample;
        } catch (error) {
            if (error instanceof ZodError) {
                // Trata erros de validação especificamente
                console.error("Erro de validação Zod:", error.errors);
                throw new Error(`Dados inválidos: ${error.errors.map(e => e.message).join(', ')}`);
            }
            console.error("Erro na criação de um novo Exemplo:", error);
            throw new Error("Falha ao criar um novo exemplo.");
        }
    }

    /**
     * Deleta um documento Example pelo seu ID.
     * @param id - O ID do documento a ser deletado.
     */
    async delete(id: string): Promise<void> {
        try {
            const example = await Example.findByIdAndDelete(id);
            if (!example) {
                console.log(`Nenhum Exemplo com o ID: ${id} foi encontrado para deleção.`);
            } else {
                console.log(`Exemplo ${id} foi deletado com sucesso!`);
            }
        } catch (error) {
            console.error(`Erro ao deletar o Exemplo ${id}:`, error);
            throw new Error("Falha ao deletar o exemplo.");
        }
    }

    /**
     * Atualiza um documento Example.
     * @param id - O ID do documento a ser atualizado.
     * @param data - Os dados para atualização, conforme o UpdateExampleDTO.
     * @returns Uma promessa que resolve para o documento IExample atualizado, ou null se não encontrado.
     */
    async update(id: string, data: UpdateExampleDTO): Promise<IExample | null> {
        try {
            const validatedData = updateExampleSchema.parse(data);
            const updatedExample = await Example.findByIdAndUpdate(
                id,
                validatedData,
                { new: true } // Retorna o documento modificado
            );

            if (!updatedExample) {
                console.log(`Nenhum exemplo com o ID: ${id} foi encontrado para a atualização.`);
                return null;
            }
            
            console.log(`Dados do exemplo com o ID: ${id} foram atualizados com sucesso!`);
            return updatedExample;
        } catch (error) {
            if (error instanceof ZodError) {
                console.error("Erro de validação Zod:", error.errors);
                throw new Error(`Dados inválidos: ${error.errors.map(e => e.message).join(', ')}`);
            }
            console.error(`Erro ao atualizar o Exemplo ${id}:`, error);
            throw new Error("Falha ao atualizar o exemplo.");
        }
    }

    /**
     * Busca um único documento Example pelo seu ID.
     * @param id - O ID do documento.
     * @returns Uma promessa que resolve para o documento IExample, ou null se não for encontrado.
     */
    async getOne(id: string): Promise<IExample | null> {
        try {
            const example = await Example.findById(id);
            return example;
        } catch (error) {
            console.error(`Erro ao buscar o Exemplo ${id}:`, error);
            throw new Error("Falha ao buscar o exemplo.");
        }
    }
}

export default new ExampleService();