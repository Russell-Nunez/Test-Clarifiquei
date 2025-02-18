// src/application/services/report.service.js

const reportRepository = require('../../domain/repositories/report.repository');

const getAllocationReport = async () => {
  const reportData = await reportRepository.getAllocationReport();
  return reportData;
};

const getCompletionTimeReport = async () => {
  // Lógica simples: retorna tudo que vier do repositório
  const reportData = await reportRepository.getCompletionTimeReport();
  return reportData;
};

module.exports = {
  getAllocationReport,
  getCompletionTimeReport,
};
