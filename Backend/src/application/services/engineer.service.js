// src/application/services/engineer.service.js

const engineerRepository = require('../../domain/repositories/engineer.repository');

const createEngineer = async (engineerData) => {
  // Valida os campos obrigatórios
  if (!engineerData.nome || !engineerData.carga_maxima || !engineerData.eficiencia) {
    throw new Error('Campos obrigatórios: nome, carga_maxima, eficiencia');
  }
  return await engineerRepository.createEngineer(engineerData);
};

const getAllEngineers = async () => {
  return await engineerRepository.getAllEngineers();
};

const getEngineerById = async (id) => {
  const engineer = await engineerRepository.getEngineerById(id);
  if (!engineer) {
    throw new Error('Engenheiro não encontrado');
  }
  return engineer;
};

const updateEngineer = async (id, engineerData) => {
  // Verifica se o engenheiro existe
  const existingEngineer = await engineerRepository.getEngineerById(id);
  if (!existingEngineer) {
    throw new Error('Engenheiro não encontrado');
  }
  return await engineerRepository.updateEngineer(id, engineerData);
};

const deleteEngineer = async (id) => {
  // Verifica se o engenheiro existe
  const existingEngineer = await engineerRepository.getEngineerById(id);
  if (!existingEngineer) {
    throw new Error('Engenheiro não encontrado');
  }
  await engineerRepository.deleteEngineer(id);
};

module.exports = {
  createEngineer,
  getAllEngineers,
  getEngineerById,
  updateEngineer,
  deleteEngineer,
};
