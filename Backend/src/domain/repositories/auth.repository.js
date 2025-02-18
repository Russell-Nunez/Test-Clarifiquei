// src/domain/repositories/auth.repository.js

const db = require('../../infrastructure/database/db');

const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM task_manager.usuarios WHERE email = $1';
  const result = await db.query(query, [email]);
  return result.rows[0];
};

const createUser = async (userData) => {
  const { nome, email, senha, role } = userData;
  const query = `
    INSERT INTO task_manager.usuarios (nome, email, senha, role)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const result = await db.query(query, [nome, email, senha, role || 'user']);
  return result.rows[0];
};

module.exports = {
  getUserByEmail,
  createUser,
};
