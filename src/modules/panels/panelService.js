import Panel from './panelModel.js';

export const createPanel = async (panelData) => {
  const newPanel = new Panel(panelData);
  return await newPanel.save();
};

export const getAllPanels = async () => {
  return await Panel.find();
};

export const getPanelById = async (id) => {
  return await Panel.findById(id);
};

export const updatePanel = async (id, updateData) => {
  return await Panel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

export const deletePanel = async (id) => {
  return await Panel.findByIdAndDelete(id);
};