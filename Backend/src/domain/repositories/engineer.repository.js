// src/domain/repositories/engineer.repository.js

const db = require('../../infrastructure/database/db');

const createEngineer = async ({ nome, carga_maxima, eficiencia }) => {
  const query = `
    INSERT INTO task_manager.engenheiros (nome, carga_maxima, eficiencia)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [nome, carga_maxima, eficiencia];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const getAllEngineers = async () => {
  const query = `SELECT * FROM task_manager.engenheiros ORDER BY id`;
  const { rows } = await db.query(query);
  return rows;
};

const getEngineerById = async (id) => {
  const query = `SELECT * FROM task_manager.engenheiros WHERE id = $1`;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

const updateEngineer = async (id, { nome, carga_maxima, eficiencia }) => {
  const query = `
    UPDATE task_manager.engenheiros
    SET nome = $1, carga_maxima = $2, eficiencia = $3, updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *
  `;
  const values = [nome, carga_maxima, eficiencia, id];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const deleteEngineer = async (id) => {
  const query = `DELETE FROM task_manager.engenheiros WHERE id = $1`;
  await db.query(query, [id]);
};

module.exports = {
  createEngineer,
  getAllEngineers,
  getEngineerById,
  updateEngineer,
  deleteEngineer,
};
