// src/presentation/routes/engineer.routes.js

const express = require('express');
const router = express.Router();
const engineerController = require('../../presentation/controllers/engineer.controller');

// Criar engenheiro
router.post('/', engineerController.createEngineer);

// Listar todos os engenheiros
router.get('/', engineerController.getAllEngineers);

// Obter um engenheiro por ID
router.get('/:id', engineerController.getEngineerById);

// Atualizar engenheiro
router.put('/:id', engineerController.updateEngineer);

// Excluir engenheiro
router.delete('/:id', engineerController.deleteEngineer);

module.exports = router;
