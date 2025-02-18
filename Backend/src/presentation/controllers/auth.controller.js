// src/presentation/controllers/auth.controller.js

const authService = require('../../application/services/auth.service');

const register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, email, senha' });
    }

    // Chama o serviço de registro
    const user = await authService.register({ nome, email, senha });
    res.status(201).json({ message: 'Usuário registrado com sucesso', user });
  } catch (err) {
    // Retorna erro 400 no caso de falha no processo de registro
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verifica se os campos foram preenchidos
    if (!email || !senha) {
      return res.status(400).json({ error: 'Campos obrigatórios: email e senha' });
    }

    // Chama o serviço de login
    const result = await authService.login(email, senha);
    res.status(200).json({ message: 'Login realizado com sucesso', ...result });
  } catch (err) {
    // Retorna erro 400 no caso de falha no login
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
};
