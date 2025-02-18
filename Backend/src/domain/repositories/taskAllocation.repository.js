const db = require('../../infrastructure/database/db');

// Função para alocar a tarefa
const allocateTask = async ({ tarefa_id, engineer_id, start_date, horas_alocadas }) => {
  const query = `
    INSERT INTO task_manager.alocacoes (tarefa_id, engineer_id, data, horas_alocadas)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [tarefa_id, engineer_id, start_date, horas_alocadas];
  const { rows } = await db.query(query, values);
  return rows[0];
};

module.exports = {
  allocateTask,  // Função de alocação
};
