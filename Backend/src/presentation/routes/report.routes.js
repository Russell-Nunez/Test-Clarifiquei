// src/presentation/routes/report.routes.js

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const authMiddleware = require('../../shared/middlewares/auth.middleware');

router.get('/allocation', authMiddleware.authenticateToken, reportController.getAllocationReport);
router.get('/completion-time', authMiddleware.authenticateToken, reportController.getCompletionTimeReport);

module.exports = router;
