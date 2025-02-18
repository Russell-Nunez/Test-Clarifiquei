// src/presentation/controllers/task.controller.js

const taskService = require('../../application/services/task.service');
const taskRepository = require('../../domain/repositories/task.repository');

const createTask = async (req, res) => {
  try {
    const newTask = await taskService.createTask(req.body);
    res.status(201).json({ message: 'Tarefa criada com sucesso', task: newTask });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskService.getTaskById(id);
    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await taskService.updateTask(id, req.body);
    res.status(200).json({ message: 'Tarefa atualizada com sucesso', task: updatedTask });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    // Validação simples dos status permitidos, se necessário:
    const validStatuses = ['pendente', 'em andamento', 'concluída'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }
    const updatedTask = await taskService.updateTaskStatus(taskId, status);
    res.status(200).json({ message: 'Status atualizado com sucesso', task: updatedTask });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await taskService.deleteTask(id);
    res.status(200).json({ message: 'Tarefa removida com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getTasksWithAllocations = async (req, res) => {
  try {
    const tasksWithAllocations = await taskRepository.getTasksWithAllocations();
    return res.status(200).json(tasksWithAllocations);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar tarefas e alocações' });
  }
};


module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTasksWithAllocations
};
