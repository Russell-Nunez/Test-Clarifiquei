// src/app.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authMiddleware = require('./shared/middlewares/auth.middleware');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Importar rutas
const authRoutes = require('./presentation/routes/auth.routes');
const engineerRoutes = require('./presentation/routes/engineer.routes');
const taskRoutes = require('./presentation/routes/task.routes');
const reportRoutes = require('./presentation/routes/report.routes');

// Rutas públicas (no requieren autenticación)
app.use('/api/auth', authRoutes);

// Rutas protegidas (requieren autenticación)
app.use('/api/engineers', authMiddleware.authenticateToken, engineerRoutes);
app.use('/api/tasks', authMiddleware.authenticateToken, taskRoutes);
app.use('/api/reports', authMiddleware.authenticateToken, reportRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.send('API is running');
});

module.exports = app;
