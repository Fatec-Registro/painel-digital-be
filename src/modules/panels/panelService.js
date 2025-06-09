import Panel from './panelModel.js';
import { updatePanelSchema } from './panelDTO.js';

class panelService {

    async getAll(){
        try {
            return await Panel.find();
        } catch (error) {
            console.log(error);
        }
    }

    async getOne(id){
        try {
            return await Panel.findOne({ _id: id });
        } catch (error) {
            console.log(error);
        }
    }

    async create(validatedData){
        try {
            const newPanel = new Panel(validatedData);
            await newPanel.save();
            return newPanel;
        } catch (error) {
            console.log(error);
            throw new Error("Erro na criação de um novo Painel: " + error.message);
        }
    }

    async update(id, data){
        try {
            const validatedData = updatePanelSchema.parse(data);
            const updatedPanel = await Panel.findByIdAndUpdate(id, validatedData, { new: true });

            if (!updatedPanel){
                console.log(`Nenhum painel com o ID: ${id} foi encontrado para a atualização.`);
                return null;
            }
            return updatedPanel;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async delete(id){
        try {
            const panel = await Panel.findByIdAndDelete(id);
            if(!panel){
                console.log(`Nenhum Painel com o ID: ${id} foi encontrado.`);
                return null;
            }
            return panel;
        } catch(error) {
            console.log(error);
        }
    }
}

export default new panelService();