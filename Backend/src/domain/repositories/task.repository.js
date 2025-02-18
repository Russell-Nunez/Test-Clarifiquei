// src/presentation/controllers/task.controller.js

const taskService = require('../../application/services/task.service');
const taskRepository = require('../../domain/repositories/task.repository');
const db = require('../../infrastructure/database/db');


const createTask = async (taskData) => {
  try {
    const query = `
      INSERT INTO task_manager.tarefas (nome, prioridade, tempo_estimado, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [taskData.nome, taskData.prioridade, taskData.tempo_estimado, taskData.status];
    const { rows } = await db.query(query, values);
    if (rows.length === 0) {
      throw new Error('Falha ao criar a tarefa no banco de dados');
    }
    return rows[0];
  } catch (error) {
    throw new Error(`createTask: ${error.message}`);
  }
};

const getAllTasks = async () => {
  try {
    const query = 'SELECT * FROM task_manager.tarefas;';
    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    throw new Error(`getAllTasks: ${error.message}`);
  }
};

const getTaskById = async (id) => {
  try {
    const query = 'SELECT * FROM task_manager.tarefas WHERE id = $1;';
    const { rows } = await db.query(query, [id]);
    if (rows.length === 0) {
      throw new Error('Tarefa não encontrada');
    }
    return rows[0];
  } catch (error) {
    throw new Error(`getTaskById: ${error.message}`);
  }
};

const updateTask = async (id, taskData) => {
  try {
    // Obtém o registro atual para permitir atualizações parciais
    const currentTask = await getTaskById(id);
    if (!currentTask) {
      throw new Error('Tarefa não encontrada para atualização');
    }
    const updated = {
      nome: taskData.nome !== undefined ? taskData.nome : currentTask.nome,
      prioridade: taskData.prioridade !== undefined ? taskData.prioridade : currentTask.prioridade,
      tempo_estimado: taskData.tempo_estimado !== undefined ? taskData.tempo_estimado : currentTask.tempo_estimado,
      status: taskData.status !== undefined ? taskData.status : currentTask.status,
      engineer_id: taskData.engineer_id !== undefined ? taskData.engineer_id : currentTask.engineer_id
    };

    const query = `
      UPDATE task_manager.tarefas
      SET nome = $1, prioridade = $2, tempo_estimado = $3, status = $4, engineer_id = $5
      WHERE id = $6
      RETURNING *;
    `;
    const values = [updated.nome, updated.prioridade, updated.tempo_estimado, updated.status, updated.engineer_id, id];
    const { rows } = await db.query(query, values);
    if (rows.length === 0) {
      throw new Error('Tarefa não encontrada para atualização');
    }
    return rows[0];
  } catch (error) {
    throw new Error(`updateTask: ${error.message}`);
  }
};

const updateTaskStatus = async (id, status) => {
  try {
    const query = `
      UPDATE task_manager.tarefas
      SET status = $1
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await db.query(query, [status, id]);
    if (rows.length === 0) {
      throw new Error('Tarefa não encontrada para atualização de status');
    }
    return rows[0];
  } catch (error) {
    throw new Error(`updateTaskStatus: ${error.message}`);
  }
};

const deleteTask = async (id) => {
  try {
    const query = 'DELETE FROM task_manager.tarefas WHERE id = $1 RETURNING *;';
    const { rows } = await db.query(query, [id]);
    if (rows.length === 0) {
      throw new Error('Tarefa não encontrada para remoção');
    }
    return rows[0];
  } catch (error) {
    throw new Error(`deleteTask: ${error.message}`);
  }
};

const getTasksWithAllocations = async () => {
  try {
    // Exemplo: LEFT JOIN para retornar tarefas com suas alocações
    const query = `
      SELECT t.*, a.*
      FROM task_manager.tarefas t
      LEFT JOIN task_manager.alocacoes a ON t.id = a.tarefa_id;
    `;
    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    throw new Error(`getTasksWithAllocations: ${error.message}`);
  }
};

const getTasksByEngineerIdAndStatus = async (engineerId, status) => {
  try {
    const query = `
      SELECT * FROM task_manager.tarefas 
      WHERE engineer_id = $1 AND status = $2;
    `;
    const values = [engineerId, status];
    const { rows } = await db.query(query, values);
    return rows;
  } catch (error) {
    throw new Error(`getTasksByEngineerIdAndStatus: ${error.message}`);
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTasksWithAllocations,
  getTasksByEngineerIdAndStatus
};