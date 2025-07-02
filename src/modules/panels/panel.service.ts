
import Panel, { IPanel } from "./panel.model.js";
import { CreatePanelDTO, UpdatePanelDTO, updatePanelSchema } from "./panel.dto.js";
import { ZodError } from "zod";

class PanelService {
  /**
   * Busca todos os painéis.
   * @returns Uma promessa que resolve para um array de documentos IPanel.
   */
  async getAll(): Promise<IPanel[]> {
    try {
      return await Panel.find();
    } catch (error) {
      console.error("Erro ao buscar todos os painéis:", error);
      throw new Error("Falha ao buscar painéis.");
    }
  }

  /**
   * Busca um único painel pelo seu ID.
   * @param id - O ID do painel.
   * @returns Uma promessa que resolve para o documento IPanel, ou null se não encontrado.
   */
  async getOne(id: string): Promise<IPanel | null> {
    try {
      return await Panel.findById(id);
    } catch (error) {
      console.error(`Erro ao buscar o painel ${id}:`, error);
      throw new Error("Falha ao buscar o painel.");
    }
  }

  /**
   * Cria um novo painel.
   * @param data - Os dados para o novo painel, conforme o CreatePanelDTO.
   * @returns Uma promessa que resolve para o novo documento IPanel criado.
   */
  async create(data: CreatePanelDTO): Promise<IPanel> {
    try {
      const newPanel = new Panel(data);
      await newPanel.save();
      return newPanel;
    } catch (error) {
      console.error("Erro na criação de um novo Painel:", error);
      throw new Error("Falha ao criar um novo painel.");
    }
  }

  /**
   * Atualiza um painel.
   * @param id - O ID do painel a ser atualizado.
   * @param data - Os dados para atualização, conforme o UpdatePanelDTO.
   * @returns Uma promessa que resolve para o documento IPanel atualizado, ou null se não encontrado.
   */
  async update(id: string, data: UpdatePanelDTO): Promise<IPanel | null> {
    try {
      const validatedData = updatePanelSchema.parse(data);
      const updatedPanel = await Panel.findByIdAndUpdate(id, validatedData, {
        new: true,
      });

      if (!updatedPanel) {
        console.log(`Nenhum painel com o ID: ${id} foi encontrado para a atualização.`);
        return null;
      }
      return updatedPanel;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(`Dados inválidos: ${error.errors.map((e) => e.message).join(", ")}`);
      }
      console.error(`Erro ao atualizar o painel ${id}:`, error);
      throw new Error("Falha ao atualizar o painel.");
    }
  }

  /**
   * Deleta um painel pelo seu ID.
   * @param id - O ID do painel a ser deletado.
   * @returns O documento deletado ou null se não for encontrado.
   */
  async delete(id: string): Promise<IPanel | null> {
    try {
      const panel = await Panel.findByIdAndDelete(id);
      if (!panel) {
        console.log(`Nenhum Painel com o ID: ${id} foi encontrado.`);
        return null;
      }
      return panel;
    } catch (error) {
      console.error(`Erro ao deletar o painel ${id}:`, error);
      throw new Error("Falha ao deletar o painel.");
    }
  }
}

export default new PanelService();