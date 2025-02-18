const taskRepository = require('../../domain/repositories/task.repository');
const taskAllocationService = require('../../application/services/taskAllocation.service');
const engineerService = require('../../application/services/engineer.service');

const createTask = async (taskData) => {
  // Verifica se os campos obrigatórios foram fornecidos
  if (!taskData.nome || !taskData.prioridade || !taskData.tempo_estimado) {
    return { success: false, error: 'Campos obrigatórios: nome, prioridade, tempo_estimado' };
  }

  // Garante que o status esteja sempre definido
  taskData.status = taskData.status || 'pendente';

  try {
    // Passo 1: Criar a tarefa no banco de dados
    const newTask = await taskRepository.createTask(taskData);

    // Garante que newTask foi criado corretamente
    if (!newTask || !newTask.id) {
      return { success: false, error: 'Falha ao criar a tarefa no banco de dados' };
    }

    // Passo 2: Tentar alocar automaticamente a tarefa
    const allocationResult = await taskAllocationService.autoAllocateTask(newTask);

    // Retorna o resultado da criação e alocação
    return {
      success: true,
      message: 'Tarefa criada e alocada com sucesso',
      task: newTask,
      allocation: allocationResult
    };
  } catch (error) {
    console.error('Erro ao criar ou alocar tarefa:', error.message);
    return {
      success: false,
      message: 'Tarefa criada, mas falha na alocação automática.',
      error: error.message,
      taskId: null,
      taskName: taskData.nome,
      status: 'pendente'
    };
  }
};

const getAllTasks = async () => {
  try {
    const tasks = await taskRepository.getAllTasks();
    return { success: true, data: tasks };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const getTaskById = async (id) => {
  try {
    const task = await taskRepository.getTaskById(id);
    if (!task) {
      return { success: false, error: 'Tarefa não encontrada' };
    }
    return { success: true, data: task };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const updateTask = async (id, taskData) => {
  try {
    const existingTask = await taskRepository.getTaskById(id);
    if (!existingTask) {
      return { success: false, error: 'Tarefa não encontrada' };
    }
    const updatedTask = await taskRepository.updateTask(id, taskData);
    return { success: true, data: updatedTask };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const deleteTask = async (id) => {
  try {
    const existingTask = await taskRepository.getTaskById(id);
    if (!existingTask) {
      return { success: false, error: 'Tarefa não encontrada' };
    }
    await taskRepository.deleteTask(id);
    return { success: true, message: 'Tarefa removida com sucesso' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const updateTaskStatus = async (taskId, newStatus) => {
  try {
    const task = await taskRepository.getTaskById(taskId);
    if (!task) {
      return { success: false, error: 'Tarefa não encontrada' };
    }

    // Se a atualização for para "em andamento", valida se o engenheiro já possui outra tarefa em andamento
    if (newStatus === 'em andamento' && task.engineer_id) {
      const tasksInProgress = await taskRepository.getTasksByEngineerIdAndStatus(task.engineer_id, 'em andamento');
      if (tasksInProgress.length > 0 && tasksInProgress.some(t => t.id !== taskId)) {
        const availableEngineers = await engineerService.getAllEngineers();
        let availableEngineer = null;
        // Itera pelos engenheiros para encontrar um disponível
        for (const engineer of availableEngineers) {
          const engineerTasks = await taskRepository.getTasksByEngineerIdAndStatus(engineer.id, 'em andamento');
          if (engineer.id !== task.engineer_id && engineerTasks.length === 0) {
            availableEngineer = engineer;
            break;
          }
        }
        if (availableEngineer) {
          await taskRepository.updateTask(taskId, { engineer_id: availableEngineer.id, status: 'em andamento' });
        } else {
          await taskRepository.updateTaskStatus(taskId, 'pendente');
          return { success: false, message: 'Nenhum engenheiro disponível. Tarefa marcada como pendente.', status: 'pendente' };
        }
      } else {
        await taskRepository.updateTaskStatus(taskId, newStatus);
      }
    } else {
      await taskRepository.updateTaskStatus(taskId, newStatus);
    }
    const updatedTask = await taskRepository.getTaskById(taskId);
    return {
      success: true,
      message: `Status da tarefa atualizado para ${newStatus}`,
      taskId,
      status: updatedTask.status,
      engineerId: updatedTask.engineer_id
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const reallocateTask = async (taskId, newEngineerId) => {
  try {
    const task = await taskRepository.getTaskById(taskId);
    if (!task) {
      return { success: false, error: 'Tarefa não encontrada' };
    }
    const engineer = await engineerService.getEngineerById(newEngineerId);
    if (!engineer) {
      return { success: false, error: 'Engenheiro não encontrado' };
    }
    const totalAllocatedHours = engineer.alocado_horas || 0;
    const availableHours = engineer.carga_maxima - totalAllocatedHours;
    if (availableHours < task.tempo_estimado) {
      return { success: false, error: 'Engenheiro não tem capacidade suficiente para esta tarefa' };
    }
    const tasksInProgress = await taskRepository.getTasksByEngineerIdAndStatus(newEngineerId, 'em andamento');
    if (tasksInProgress.length > 0) {
      return { success: false, error: 'Engenheiro já possui uma tarefa em andamento' };
    }
    await taskRepository.updateTask(taskId, { engineer_id: newEngineerId });
    if (task.status === 'pendente') {
      await taskRepository.updateTaskStatus(taskId, 'em andamento');
    }
    const updatedTask = await taskRepository.getTaskById(taskId);
    const allocationResult = await taskAllocationService.autoAllocateTask(updatedTask);
    return {
      success: true,
      message: 'Tarefa realocada com sucesso',
      taskId,
      newEngineerId,
      engineerName: engineer.nome,
      status: updatedTask.status,
      allocations: allocationResult.allocations
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  reallocateTask
};
