-- init.sql

-- Criação do schema task_manager
CREATE SCHEMA IF NOT EXISTS task_manager;

-- Tabela de Usuários (para autenticação)
CREATE TABLE IF NOT EXISTS task_manager.usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Engenheiros
CREATE TABLE IF NOT EXISTS task_manager.engenheiros (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    carga_maxima NUMERIC NOT NULL,  -- carga máxima de trabalho em horas
    eficiencia NUMERIC NOT NULL,    -- fator de eficiência (ex: 1.2 para 20% mais rápido)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Tarefas
CREATE TABLE IF NOT EXISTS task_manager.tarefas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    prioridade VARCHAR(10) NOT NULL CHECK (prioridade IN ('alta', 'media', 'baixa')),
    tempo_estimado NUMERIC NOT NULL,  -- tempo estimado para execução em horas
    status VARCHAR(20) NOT NULL CHECK (status IN ('pendente', 'em andamento', 'concluída')),
    engineer_id INTEGER REFERENCES task_manager.engenheiros(id), -- engenheiro alocado (pode ser nulo)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Alocações Detalhadas (para divisão de tarefas por dia, respeitando o limite de 8 horas diárias)
CREATE TABLE IF NOT EXISTS task_manager.alocacoes (
    id SERIAL PRIMARY KEY,
    tarefa_id INTEGER NOT NULL REFERENCES task_manager.tarefas(id) ON DELETE CASCADE,
    engineer_id INTEGER NOT NULL REFERENCES task_manager.engenheiros(id) ON DELETE CASCADE,
    data DATE NOT NULL,             -- data da alocação
    horas_alocadas NUMERIC NOT NULL -- quantidade de horas alocadas para este dia
);
