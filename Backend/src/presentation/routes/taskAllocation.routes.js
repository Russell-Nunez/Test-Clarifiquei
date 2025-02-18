const express = require('express');
const taskAllocationController = require('../controllers/taskAllocation.controller');

const router = express.Router();

// Rota para alocar uma tarefa automaticamente
router.post('/allocate', taskAllocationController.allocateTask);

module.exports = router;
