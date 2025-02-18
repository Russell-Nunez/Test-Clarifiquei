// src/presentation/controllers/engineer.controller.js

const engineerService = require('../../application/services/engineer.service');

const createEngineer = async (req, res) => {
  try {
    const newEngineer = await engineerService.createEngineer(req.body);
    res.status(201).json({ message: 'Engenheiro criado com sucesso', engineer: newEngineer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllEngineers = async (req, res) => {
  try {
    const engineers = await engineerService.getAllEngineers();
    res.status(200).json(engineers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEngineerById = async (req, res) => {
  try {
    const { id } = req.params;
    const engineer = await engineerService.getEngineerById(id);
    res.status(200).json(engineer);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateEngineer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEngineer = await engineerService.updateEngineer(id, req.body);
    res.status(200).json({ message: 'Engenheiro atualizado com sucesso', engineer: updatedEngineer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteEngineer = async (req, res) => {
  try {
    const { id } = req.params;
    await engineerService.deleteEngineer(id);
    res.status(200).json({ message: 'Engenheiro removido com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createEngineer,
  getAllEngineers,
  getEngineerById,
  updateEngineer,
  deleteEngineer,
};
