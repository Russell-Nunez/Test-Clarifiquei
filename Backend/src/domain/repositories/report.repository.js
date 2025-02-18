// src/domain/repositories/report.repository.js

const db = require('../../infrastructure/database/db');

const getAllocationReport = async () => {
  const query = `
    SELECT 
      e.id AS engineer_id, 
      e.nome AS engineer_name, 
      e.carga_maxima, 
      e.eficiencia,
      COALESCE(
        json_agg(
          json_build_object(
            'task_id', t.id,
            'task_name', t.nome,
            'prioridade', t.prioridade,
            'tempo_estimado', t.tempo_estimado,
            'status', t.status,
            'tempo_estimado_com_eficiencia', 
              CASE 
                WHEN t.id IS NOT NULL THEN 
                  ROUND(
                    CASE 
                      WHEN t.tempo_estimado - (t.tempo_estimado * e.eficiencia / 100) < 1 
                      THEN (t.tempo_estimado - (t.tempo_estimado * e.eficiencia / 100)) * 60 
                      ELSE (t.tempo_estimado - (t.tempo_estimado * e.eficiencia / 100))
                    END, 2
                  )
                ELSE NULL 
              END,
            'tempo_ajustado',
              CASE 
                WHEN t.id IS NOT NULL THEN 
                  ROUND(
                    t.tempo_estimado - (t.tempo_estimado - (t.tempo_estimado * e.eficiencia / 100)), 2
                  )
                ELSE NULL 
              END
          )
        ) FILTER (WHERE t.id IS NOT NULL),
        '[]'
      ) AS tasks,
      
      -- Ajuste para o total_tempo_estimado_com_eficiencia
      COALESCE(
        ROUND(
          SUM(CASE WHEN t.id IS NOT NULL THEN 
            CASE 
              WHEN t.tempo_estimado - (t.tempo_estimado * e.eficiencia / 100) < 1 
              THEN (t.tempo_estimado - (t.tempo_estimado * e.eficiencia / 100)) * 60
              ELSE (t.tempo_estimado - (t.tempo_estimado * e.eficiencia / 100))
            END 
            ELSE 0 END), 2
        ),
        0
      ) AS total_tempo_estimado_com_eficiencia,

      -- Ajuste para o total_tempo_ajustado
      COALESCE(
        ROUND(
          SUM(CASE WHEN t.id IS NOT NULL THEN 
            t.tempo_estimado - (t.tempo_estimado - (t.tempo_estimado * e.eficiencia / 100)) 
            ELSE 0 END), 2
        ),
        0
      ) AS total_tempo_ajustado

    FROM task_manager.engenheiros e
    LEFT JOIN task_manager.tarefas t ON e.id = t.engineer_id
    GROUP BY e.id, e.nome, e.carga_maxima, e.eficiencia
    ORDER BY e.id;
  `;
  const { rows } = await db.query(query);
  return rows;
};


/**
 * Retorna o "tempo de conclusão" de cada engenheiro,
 * considerando tarefas que não estão concluídas.
 * Ajuste conforme sua regra de negócio.
 */
const getCompletionTimeReport = async () => {
  const query = `
    SELECT 
      e.id AS engineer_id,
      e.nome AS engineer_name,
      SUM(CASE WHEN t.status != 'concluída' THEN (t.tempo_estimado / e.eficiencia) ELSE 0 END) AS tempo_estimado
    FROM task_manager.engenheiros e
    LEFT JOIN task_manager.tarefas t ON e.id = t.engineer_id
    GROUP BY e.id, e.nome
    ORDER BY e.id;
  `;
  const { rows } = await db.query(query);
  return rows;
};

module.exports = {
  getAllocationReport,
  getCompletionTimeReport,
};
