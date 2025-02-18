// task.routes.js

const express = require('express');
const router = express.Router();
const taskController = require('../../presentation/controllers/task.controller');

// Nova rota para buscar tarefas com tempo_estimado > 8 horas e suas alocações
router.get('/long-tasks-with-allocations', taskController.getTasksWithAllocations);  // Certifique-se de que essa rota é registrada antes de outras que usem :id

// Rota para criar uma nova tarefa
router.post('/', taskController.createTask);

// Rota para buscar todas as tarefas
router.get('/', taskController.getAllTasks);

// Rota para buscar uma tarefa por ID
router.get('/:id', taskController.getTaskById);

// Rota para atualizar uma tarefa
router.put('/:id', taskController.updateTask);

// Rota para atualizar o status de uma tarefa
router.patch('/:taskId/status', taskController.updateTaskStatus); // Endpoint para atualizar o status

// Rota para excluir uma tarefa
router.delete('/:id', taskController.deleteTask);

module.exports = router;
