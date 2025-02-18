const taskAllocationService = require('../../application/services/taskAllocation.service');
const taskRepository = require('../../domain/repositories/task.repository');

// Função para alocar a tarefa automaticamente
const allocateTask = async (req, res) => {
  try {
    const { tarefa_id } = req.body;

    // Passo 1: Obter a tarefa que precisa ser alocada
    const task = await taskRepository.getTaskById(tarefa_id);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    // Passo 2: Realizar a alocação automática
    const allocation = await taskAllocationService.autoAllocateTask(task);

    // Passo 3: Retornar sucesso
    res.status(200).json(allocation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  allocateTask,  // Função para alocação de tarefas
};
