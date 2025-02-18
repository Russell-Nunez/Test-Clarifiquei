// src/application/services/auth.service.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const authRepository = require('../../domain/repositories/auth.repository');

dotenv.config();

const register = async (userData) => {
  const { nome, email, senha } = userData;

  // Verifica se os campos obrigatórios foram preenchidos
  if (!nome || !email || !senha) {
    throw new Error('Campos obrigatórios: nome, email, senha');
  }

  // Verifica se o usuário já existe
  const existingUser = await authRepository.getUserByEmail(email);
  if (existingUser) {
    throw new Error('Usuário já existe');
  }

  // Cria o hash da senha
  const hashedPassword = await bcrypt.hash(senha, 10);
  const newUser = await authRepository.createUser({
    nome,
    email,
    senha: hashedPassword,
  });

  return newUser;  // Retorna o usuário recém-criado
};

const login = async (email, senha) => {
  if (!email || !senha) {
    throw new Error('Campos obrigatórios: email e senha');
  }

  const user = await authRepository.getUserByEmail(email);
  if (!user) {
    throw new Error('Credenciais inválidas');
  }

  const isMatch = await bcrypt.compare(senha, user.senha);
  if (!isMatch) {
    throw new Error('Credenciais inválidas');
  }

  // Gera o token JWT
  const payload = { id: user.id, email: user.email, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return { user, token };  // Retorna o usuário e o token JWT
};

module.exports = {
  register,
  login,
};
