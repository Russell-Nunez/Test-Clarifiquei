const engineerRepository = require('../../domain/repositories/engineer.repository');
const taskRepository = require('../../domain/repositories/task.repository');
const allocationRepository = require('../../domain/repositories/taskAllocation.repository');

// Função para alocar tarefas automaticamente
const autoAllocateTask = async (task) => {
  try {
    // Passo 1: Obter todos os engenheiros disponíveis
    const engineers = await engineerRepository.getAllEngineers();

    // Passo 2: Filtrar engenheiros com capacidade disponível
    const availableEngineers = engineers.filter(engineer => {
      const totalAllocatedHours = engineer.alocado_horas || 0;
      const availableHours = engineer.carga_maxima - totalAllocatedHours;
      return availableHours >= task.tempo_estimado;
    });

    if (availableEngineers.length === 0) {
      return { 
        success: false, 
        error: 'Nenhum engenheiro disponível com capacidade suficiente para alocar a tarefa' 
      };
    }

    // Passo 3: Selecionar um engenheiro sem tarefas em andamento
    let selectedEngineer = null;
    for (let engineer of availableEngineers) {
      const tasksInProgress = await taskRepository.getTasksByEngineerIdAndStatus(engineer.id, 'em andamento');
      if (tasksInProgress.length === 0) {
        selectedEngineer = engineer;
        break;
      }
    }

    // Passo 4: Se não houver engenheiro sem tarefas em andamento, selecionar o primeiro disponível
    if (!selectedEngineer) {
      selectedEngineer = availableEngineers[0];
    }

    // Passo 5: Ajustar o tempo estimado conforme a eficiência do engenheiro
    const adjustedTime = task.tempo_estimado / (selectedEngineer.eficiencia / 100);

    // Passo 6: Dividir a tarefa em múltiplos dias, se necessário
    let remainingTime = adjustedTime;
    let startDate = new Date();
    let alocacoes = [];

    while (remainingTime > 0) {
      const hoursToAllocate = Math.min(remainingTime, 8);
      const allocation = {
        tarefa_id: task.id,
        engineer_id: selectedEngineer.id,
        start_date: startDate.toISOString().split('T')[0],
        horas_alocadas: hoursToAllocate,
      };

      await allocationRepository.allocateTask(allocation);
      alocacoes.push(allocation);

      remainingTime -= hoursToAllocate;
      startDate.setDate(startDate.getDate() + 1);
    }

    // Passo 7: Atualizar o campo engineer_id da tarefa
    await taskRepository.updateTask(task.id, { engineer_id: selectedEngineer.id });

    // Passo 8: Atualizar o status da tarefa
    await taskRepository.updateTaskStatus(task.id, 'em andamento');

    // Passo 9: Retornar a resposta com as alocações feitas
    return {
      success: true,
      message: 'Tarefa alocada com sucesso!',
      taskId: task.id,
      taskName: task.nome,
      engineerId: selectedEngineer.id,
      engineerName: selectedEngineer.nome,
      allocations: alocacoes,
      status: 'em andamento',
    };
  } catch (error) {
    console.error('Erro em autoAllocateTask:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Função para alocar tarefas manualmente
const allocateTask = async ({ tarefa_id, engineer_id, start_date, horas_alocadas }) => {
  try {
    const task = await taskRepository.getTaskById(tarefa_id);
    const engineer = await engineerRepository.getEngineerById(engineer_id);

    if (!task || !engineer) {
      return { 
        success: false, 
        error: 'Tarefa ou Engenheiro não encontrado' 
      };
    }

    // Verificar se o engenheiro já tem uma tarefa em andamento
    const tasksInProgress = await taskRepository.getTasksByEngineerIdAndStatus(engineer_id, 'em andamento');
    if (tasksInProgress.length > 0 && tasksInProgress.some(t => t.id !== tarefa_id)) {
      return { 
        success: false, 
        error: 'Engenheiro já possui uma tarefa em andamento' 
      };
    }

    // Se horas_alocadas não for fornecido, calcular com base na eficiência do engenheiro
    if (!horas_alocadas) {
      horas_alocadas = task.tempo_estimado / (engineer.eficiencia / 100);
    }

    // Verificar se as horas excedem o limite diário
    if (horas_alocadas > 8) {
      let remainingHours = horas_alocadas;
      let currentDate = new Date(start_date);
      let allocations = [];

      while (remainingHours > 0) {
        const dailyHours = Math.min(remainingHours, 8);
        const allocation = {
          tarefa_id: tarefa_id,
          engineer_id: engineer_id,
          start_date: currentDate.toISOString().split('T')[0],
          horas_alocadas: dailyHours,
        };

        await allocationRepository.allocateTask(allocation);
        allocations.push(allocation);

        remainingHours -= dailyHours;
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Atualizar o campo engineer_id na tabela tarefas
      await taskRepository.updateTask(task.id, { engineer_id: engineer_id });

      // Atualizar o status da tarefa
      await taskRepository.updateTaskStatus(task.id, 'em andamento');

      return {
        success: true,
        message: 'Tarefa alocada com sucesso em múltiplos dias!',
        taskId: task.id,
        engineerId: engineer.id,
        allocations: allocations,
        status: 'em andamento'
      };
    } else {
      // Caso seja menor ou igual a 8 horas, alocar normalmente
      await allocationRepository.allocateTask({
        tarefa_id: task.id,
        engineer_id: engineer.id,
        start_date,
        horas_alocadas,
      });

      // Atualizar o campo engineer_id na tabela tarefas
      await taskRepository.updateTask(task.id, { engineer_id: engineer.id });

      // Atualizar o status da tarefa
      await taskRepository.updateTaskStatus(task.id, 'em andamento');

      return {
        success: true,
        message: 'Tarefa alocada com sucesso!',
        taskId: task.id,
        engineerId: engineer.id,
        allocation: {
          start_date,
          horas_alocadas
        },
        status: 'em andamento'
      };
    }
  } catch (error) {
    console.error('Erro em allocateTask:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Função para desalocar todas as alocações de uma tarefa
const deallocateTask = async (taskId) => {
  try {
    const task = await taskRepository.getTaskById(taskId);

    if (!task) {
      return { 
        success: false, 
        error: 'Tarefa não encontrada' 
      };
    }

    // Remover todas as alocações para esta tarefa
    await allocationRepository.removeAllocationsByTaskId(taskId);

    // Atualizar o status da tarefa para pendente
    await taskRepository.updateTaskStatus(taskId, 'pendente');

    // Limpar o engineer_id da tarefa
    await taskRepository.updateTask(taskId, { engineer_id: null });

    return {
      success: true,
      message: 'Tarefa desalocada com sucesso',
      taskId,
      status: 'pendente'
    };
  } catch (error) {
    console.error('Erro em deallocateTask:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Função para obter todas as alocações
const getAllAllocations = async () => {
  try {
    return await allocationRepository.getAllAllocations();
  } catch (error) {
    console.error('Erro em getAllAllocations:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Função para obter alocações por ID de tarefa
const getAllocationsByTaskId = async (taskId) => {
  try {
    return await allocationRepository.getAllocationsByTaskId(taskId);
  } catch (error) {
    console.error('Erro em getAllocationsByTaskId:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Função para obter alocações por ID de engenheiro
const getAllocationsByEngineerId = async (engineerId) => {
  try {
    return await allocationRepository.getAllocationsByEngineerId(engineerId);
  } catch (error) {
    console.error('Erro em getAllocationsByEngineerId:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

module.exports = {
  autoAllocateTask,
  allocateTask,
  deallocateTask,
  getAllAllocations,
  getAllocationsByTaskId,
  getAllocationsByEngineerId
};