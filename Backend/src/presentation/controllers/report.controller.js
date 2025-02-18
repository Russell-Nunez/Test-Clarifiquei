// src/presentation/controllers/report.controller.js

const reportService = require('../../application/services/report.service');

const getAllocationReport = async (req, res) => {
  try {
    const report = await reportService.getAllocationReport();
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
};

const getCompletionTimeReport = async (req, res) => {
  try {
    const report = await reportService.getCompletionTimeReport();
    // Se não vier nada, 404
    if (!report || report.length === 0) {
      return res.status(404).json({ error: 'Nenhum dado encontrado para o relatório' });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter tempo de conclusão' });
  }
};

module.exports = {
  getAllocationReport,
  getCompletionTimeReport,
};
