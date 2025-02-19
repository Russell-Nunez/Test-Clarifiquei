# **Documentação do Projeto - TaskMaster**

## **1. Estrutura do Backend**

### **1.1 Diretório Principal**

- `server.js` – Arquivo principal que inicia o servidor.
- `app.js` – Configuração do Express e carregamento dos middlewares.

### **1.2 Diretório `src/`**

O código-fonte do backend está organizado dentro de `src/`, dividido em múltiplos módulos conforme responsabilidade.

#### **1.2.1 `application/services/`**

Contém a lógica de negócio do sistema.

- `auth.service.js` – Gerenciamento de autenticação e tokens.
- `engineer.service.js` – Regras de negócio relacionadas a engenheiros.
- `report.service.js` – Geração de relatórios do sistema.
- `task.service.js` – Manipulação e validação de tarefas.
- `taskAllocation.service.js` – Lógica de alocação automática e manual de tarefas.

#### **1.2.2 `domain/repositories/`**

Contém os repositórios responsáveis pela comunicação com o banco de dados.

- `auth.repository.js` – Operações relacionadas à autenticação no banco.
- `engineer.repository.js` – Gerenciamento de engenheiros no banco.
- `report.repository.js` – Extração de dados para relatórios.
- `task.repository.js` – Operações com a tabela de tarefas.
- `taskAllocation.repository.js` – Gestão das alocações no banco de dados.

#### **1.2.3 `infrastructure/database/`**

Contém a configuração e scripts do banco de dados.

- `db.js` – Configuração da conexão com o banco de dados PostgreSQL.
- `init.sql` – Script de inicialização do banco de dados.

#### **1.2.4 `presentation/controllers/`**

Gerencia as requisições HTTP, recebendo dados e acionando os serviços.

- `auth.controller.js` – Controlador de autenticação.
- `engineer.controller.js` – Controlador para operações de engenheiros.
- `report.controller.js` – Controlador responsável por gerar relatórios.
- `task.controller.js` – Controlador de criação, atualização e remoção de tarefas.
- `taskAllocation.controller.js` – Controlador de alocação de tarefas.

#### **1.2.5 `presentation/routes/`**

Define as rotas da API e vincula com os controladores.

- `auth.routes.js` – Rotas de autenticação.
- `engineer.routes.js` – Rotas para gerenciamento de engenheiros.
- `report.routes.js` – Rotas para relatórios.
- `task.routes.js` – Rotas para tarefas.
- `taskAllocation.routes.js` – Rotas para alocação de tarefas.

#### **1.2.6 `shared/middlewares/`**

Contém middlewares globais utilizados pelo sistema.

- `auth.middleware.js` – Middleware de autenticação.

---

## **2. Endpoints da API**

### **2.1 Autenticação**

#### **2.1.1 Rota para Registrar Usuário**

- **URL:** `http://localhost:3001/api/auth/register`
- **Método:** `POST`
- **Body (JSON):**
  ```json
  {
    "nome": "João Silva",
    "email": "joao.silva@email.com",
    "senha": "senhaSegura123"
  }
  ```
- **Restrições e Validações:**
  - `nome` deve ser uma **string** e não pode estar vazio.
  - `email` deve ser um e-mail válido e único no banco de dados.
  - `senha` deve ter no mínimo **8 caracteres** e conter letras e números.

- **Resposta esperada (sucesso - 201):**
  ```json
  {
    "message": "Usuário registrado com sucesso",
    "user": {
      "id": 1,
      "nome": "João Silva",
      "email": "joao.silva@email.com",
      "role": "user",
      "created_at": "2024-02-19T12:34:56.789Z"
      "updated_at": "2024-02-19T12:34:56.789Z"
    }
  }
  ```

- **Resposta esperada (erro - 400)** (Caso falte um campo obrigatório):
  ```json
  {
    "error": "Campos obrigatórios: nome, email, senha"
  }
  ```

- **Resposta esperada (erro - 400)** (Caso o e-mail já esteja em uso):
  ```json
  {
    "error": "E-mail já registrado"
  }
  ```

---

#### **2.1.2 Rota para Login**

- **URL:** `http://localhost:3001/api/auth/login`
- **Método:** `POST`
- **Body (JSON):**
  ```json
  {
    "email": "joao.silva@email.com",
    "senha": "senhaSegura123"
  }
  ```
- **Restrições e Validações:**
  - `email` deve ser um e-mail válido cadastrado no sistema.
  - `senha` deve ser a correta para o e-mail informado.

- **Resposta esperada (sucesso - 200):**
  ```json
  {
    "message": "Login realizado com sucesso",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "nome": "João Silva",
      "email": "joao.silva@email.com",
      "role": "user"
    }
  }
  ```

- **Resposta esperada (erro - 400)** (Caso falte um campo obrigatório):
  ```json
  {
    "error": "Campos obrigatórios: email e senha"
  }
  ```

- **Resposta esperada (erro - 400)** (Caso o e-mail não esteja cadastrado ou a senha esteja incorreta):
  ```json
  {
    "error": "Credenciais inválidas"
  }
  ```

### **2.2 Engenheiros**

#### **2.2.1 Criar Engenheiro**

- **URL:** `http://localhost:3001/api/engineers`
- **Método:** `POST`
- **Body (JSON):**
  ```json
  {
    "nome": "Carlos Andrade",
    "carga_maxima": 40,
    "eficiencia": 90
  }
  ```
- **Restrições e Validações:**
  - `nome` deve ser uma **string** e não pode estar vazio.
  - `carga_maxima` deve ser um **número inteiro positivo** representando a carga máxima de trabalho.
  - `eficiencia` deve ser um **número inteiro entre 0 e 100**, representando a eficiência do engenheiro.

- **Resposta esperada (sucesso - 201):**
  ```json
  {
    "message": "Engenheiro criado com sucesso",
    "engineer": {
      "id": 1,
      "nome": "Carlos Andrade",
      "carga_maxima": 40,
      "eficiencia": 90,
      "created_at": "2024-02-19T12:34:56.789Z"
    }
  }
  ```

- **Resposta esperada (erro - 400)** (Caso falte um campo obrigatório):
  ```json
  {
    "error": "Campos obrigatórios: nome, carga_maxima, eficiencia"
  }
  ```

- **Resposta esperada (erro - 400)** (Caso `eficiencia` ou `carga_maxima` tenham valores inválidos):
  ```json
  {
    "error": "Os campos carga_maxima e eficiencia devem ser valores numéricos válidos"
  }
  ```

---

#### **2.2.2 Listar Todos os Engenheiros**

- **URL:** `http://localhost:3001/api/engineers`
- **Método:** `GET`
- **Resposta esperada (sucesso - 200):**
  ```json
  [
    {
      "id": 1,
      "nome": "Carlos Andrade",
      "carga_maxima": 40,
      "eficiencia": 90,
      "created_at": "2024-02-19T12:34:56.789Z"
    },
    {
      "id": 2,
      "nome": "Mariana Souza",
      "carga_maxima": 35,
      "eficiencia": 85,
      "created_at": "2024-02-19T12:35:56.789Z"
    }
  ]
  ```

---

#### **2.2.3 Obter um Engenheiro por ID**

- **URL:** `http://localhost:3001/api/engineers/:id`
- **Método:** `GET`
- **Resposta esperada (sucesso - 200):**
  ```json
  {
    "id": 1,
    "nome": "Carlos Andrade",
    "carga_maxima": 40,
    "eficiencia": 90,
    "created_at": "2024-02-19T12:34:56.789Z"
  }
  ```

- **Resposta esperada (erro - 404)** (Caso o engenheiro não exista):
  ```json
  {
    "error": "Engenheiro não encontrado"
  }
  ```

---

#### **2.2.4 Atualizar Engenheiro**

- **URL:** `http://localhost:3001/api/engineers/:id`
- **Método:** `PUT`
- **Body (JSON):**
  ```json
  {
    "nome": "Carlos A. Andrade",
    "carga_maxima": 42,
    "eficiencia": 92
  }
  ```

- **Resposta esperada (sucesso - 200):**
  ```json
  {
    "message": "Engenheiro atualizado com sucesso",
    "engineer": {
      "id": 1,
      "nome": "Carlos A. Andrade",
      "carga_maxima": 42,
      "eficiencia": 92,
      "updated_at": "2024-02-19T13:00:00.789Z"
    }
  }
  ```

- **Resposta esperada (erro - 400)** (Caso os valores informados sejam inválidos):
  ```json
  {
    "error": "Os campos carga_maxima e eficiencia devem ser valores numéricos válidos"
  }
  ```

- **Resposta esperada (erro - 404)** (Caso o engenheiro não exista):
  ```json
  {
    "error": "Engenheiro não encontrado"
  }
  ```

---

#### **2.2.5 Excluir Engenheiro**

- **URL:** `http://localhost:3001/api/engineers/:id`
- **Método:** `DELETE`
- **Resposta esperada (sucesso - 200):**
  ```json
  {
    "message": "Engenheiro removido com sucesso"
  }
  ```

- **Resposta esperada (erro - 404)** (Caso o engenheiro não exista):
  ```json
  {
    "error": "Engenheiro não encontrado"
  }
  ```



### **2.3 Tarefas**

#### **2.3.1 Criar Tarefa**

- **URL:** `http://localhost:3001/api/tasks`
- **Método:** `POST`
- **Body (JSON):**
  ```json
  {
    "nome": "Desenvolver API",
    "prioridade": "alta",
    "tempo_estimado": 12,
    "status": "pendente",
    "engineer_id": 1
  }
  ```
- **Restrições e Validações:**
  - `nome` deve ser uma **string** e não pode estar vazio.
  - `prioridade` deve ser **"alta"**, **"média"** ou **"baixa"**.
  - `tempo_estimado` deve ser um **número positivo** representando horas.
  - `status` deve ser **"pendente"**, **"em andamento"** ou **"concluída"**.
  - `engineer_id` deve ser um **ID válido de um engenheiro cadastrado**.

- **Resposta esperada (sucesso - 201):**
  ```json
  {
    "message": "Tarefa criada com sucesso",
    "task": {
      "id": 1,
      "nome": "Desenvolver API",
      "prioridade": "alta",
      "tempo_estimado": 12,
      "status": "pendente",
      "engineer_id": 1,
      "created_at": "2024-02-19T12:34:56.789Z"
    }
  }
  ```

- **Resposta esperada (erro - 400)** (Caso falte um campo obrigatório):
  ```json
  {
    "error": "Campos obrigatórios: nome, prioridade, tempo_estimado"
  }
  ```

---

#### **2.3.2 Listar Todas as Tarefas**

- **URL:** `http://localhost:3001/api/tasks`
- **Método:** `GET`
- **Resposta esperada (sucesso - 200):**
  ```json
  [
    {
      "id": 1,
      "nome": "Desenvolver API",
      "prioridade": "alta",
      "tempo_estimado": 12,
      "status": "pendente",
      "engineer_id": 1,
      "created_at": "2024-02-19T12:34:56.789Z"
    },
    {
      "id": 2,
      "nome": "Testes de integração",
      "prioridade": "média",
      "tempo_estimado": 8,
      "status": "em andamento",
      "engineer_id": 2,
      "created_at": "2024-02-19T13:00:00.789Z"
    }
  ]
  ```

---

#### **2.3.3 Obter uma Tarefa por ID**

- **URL:** `http://localhost:3001/api/tasks/:id`
- **Método:** `GET`
- **Resposta esperada (sucesso - 200):**
  ```json
  {
    "id": 1,
    "nome": "Desenvolver API",
    "prioridade": "alta",
    "tempo_estimado": 12,
    "status": "pendente",
    "engineer_id": 1,
    "created_at": "2024-02-19T12:34:56.789Z"
  }
  ```

- **Resposta esperada (erro - 404)** (Caso a tarefa não exista):
  ```json
  {
    "error": "Tarefa não encontrada"
  }
  ```

---

#### **2.3.4 Atualizar Tarefa**

- **URL:** `http://localhost:3001/api/tasks/:id`
- **Método:** `PUT`
- **Body (JSON):**
  ```json
  {
    "nome": "Refatorar API",
    "prioridade": "média",
    "tempo_estimado": 10,
    "status": "pendente",
    "engineer_id": 2
  }
  ```

- **Resposta esperada (sucesso - 200):**
  ```json
  {
    "message": "Tarefa atualizada com sucesso",
    "task": {
      "id": 1,
      "nome": "Refatorar API",
      "prioridade": "média",
      "tempo_estimado": 10,
      "status": "pendente",
      "engineer_id": 2,
      "updated_at": "2024-02-19T13:30:00.789Z"
    }
  }
  ```

- **Resposta esperada (erro - 404)** (Caso a tarefa não seja encontrada):
  ```json
  {
    "error": "Tarefa não encontrada"
  }
  ```

---

#### **2.3.5 Atualizar Status da Tarefa**

- **URL:** `http://localhost:3001/api/tasks/:taskId/status`
- **Método:** `PATCH`
- **Body (JSON):**
  ```json
  {
    "status": "concluída"
  }
  ```

- **Resposta esperada (sucesso - 200):**
  ```json
  {
    "message": "Status atualizado com sucesso",
    "task": {
      "id": 1,
      "status": "concluída"
    }
  }
  ```

- **Resposta esperada (erro - 400)** (Caso o status seja inválido):
  ```json
  {
    "error": "Status inválido"
  }
  ```

- **Resposta esperada (erro - 404)** (Caso a tarefa não seja encontrada):
  ```json
  {
    "error": "Tarefa não encontrada"
  }
  ```

---

#### **2.3.6 Excluir Tarefa**

- **URL:** `http://localhost:3001/api/tasks/:id`
- **Método:** `DELETE`
- **Resposta esperada (sucesso - 200):**
  ```json
  {
    "message": "Tarefa removida com sucesso"
  }
  ```

- **Resposta esperada (erro - 404)** (Caso a tarefa não seja encontrada):
  ```json
  {
    "error": "Tarefa não encontrada"
  }
  ```



### **2.4 Relatórios**

#### **2.4.1 Relatório de Alocação de Tarefas**
- **URL:** `http://localhost:3001/api/reports/allocation`
- **Método:** `GET`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer SEU_TOKEN_AQUI"
  }
  ```
- **Descrição:** Retorna a alocação de tarefas por engenheiro, incluindo o tempo estimado com eficiência e tempo ajustado.

- **Resposta esperada (sucesso - 200):**
  ```json
  {
    "report": [
      {
        "engineer_id": 1,
        "engineer_name": "Carlos Andrade",
        "carga_maxima": 40,
        "eficiencia": 90,
        "tasks": [
          {
            "task_id": 3,
            "task_name": "Desenvolver API",
            "prioridade": "alta",
            "tempo_estimado": 12,
            "status": "pendente",
            "tempo_estimado_com_eficiencia": 1.2,
            "tempo_ajustado": 10.8
          },
          {
            "task_id": 7,
            "task_name": "Implementar autenticação",
            "prioridade": "média",
            "tempo_estimado": 6,
            "status": "em andamento",
            "tempo_estimado_com_eficiencia": 0.6,
            "tempo_ajustado": 5.4
          }
        ],
        "total_tempo_estimado_com_eficiencia": 1.8,
        "total_tempo_ajustado": 16.2
      },
      {
        "engineer_id": 2,
        "engineer_name": "Mariana Souza",
        "carga_maxima": 35,
        "eficiencia": 85,
        "tasks": [],
        "total_tempo_estimado_com_eficiencia": 0,
        "total_tempo_ajustado": 0
      }
    ]
  }
  ```

- **Resposta esperada (erro - 401)** (Caso o token seja inválido ou ausente):
  ```json
  {
    "error": "Token de autenticação inválido ou ausente"
  }
  ```

- **Resposta esperada (erro - 500)** (Caso ocorra um erro inesperado no servidor):
  ```json
  {
    "error": "Erro ao gerar relatório de alocação de tarefas"
  }
  ```

---

#### **2.4.2 Relatório de Tempo de Conclusão de Tarefas**
- **URL:** `http://localhost:3001/api/reports/completion-time`
- **Método:** `GET`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer SEU_TOKEN_AQUI"
  }
  ```
- **Descrição:** Retorna o tempo estimado de conclusão das tarefas para cada engenheiro, considerando apenas as tarefas pendentes ou em andamento.

- **Resposta esperada (sucesso - 200):**
  ```json
  {
    "report": [
      {
        "engineer_id": 1,
        "engineer_name": "Carlos Andrade",
        "tempo_estimado": 22.5
      },
      {
        "engineer_id": 2,
        "engineer_name": "Mariana Souza",
        "tempo_estimado": 18.3
      }
    ]
  }
  ```

- **Resposta esperada (erro - 401)** (Caso o token seja inválido ou ausente):
  ```json
  {
    "error": "Token de autenticação inválido ou ausente"
  }
  ```

- **Resposta esperada (erro - 404)** (Caso não haja dados para o relatório):
  ```json
  {
    "error": "Nenhum dado encontrado para o relatório de tempo de conclusão"
  }
  ```

- **Resposta esperada (erro - 500)** (Caso ocorra um erro inesperado no servidor):
  ```json
  {
    "error": "Erro ao obter relatório de tempo de conclusão"
  }
  ```




### 2.5 Alocação de Tarefas

#### 2.5.1 Alocar uma Tarefa Automaticamente
- URL: http://localhost:3001/api/task-allocation/allocate
- Método: POST
- Descrição: Aloca automaticamente uma tarefa para um engenheiro disponível.
- Body (JSON):
  ```json
  {
    "task_id": 1
  }
  ```
- Resposta esperada (sucesso - 201):
  ```json
  {
    "message": "Tarefa alocada com sucesso",
    "allocation": {
      "task_id": 1,
      "engineer_id": 3,
      "horas_alocadas": 8
    }
  }
  ```

### 3. Escolha da Arquitetura - Layered Architecture

Para a estrutura do backend, optei por utilizar a **arquitetura em camadas (Layered Architecture)** porque ela organiza o código em diferentes níveis de responsabilidade, tornando o sistema mais modular, flexível e fácil de manter. Esse padrão é amplamente utilizado no desenvolvimento de aplicações backend robustas.

---

## **Por que escolhi a arquitetura em camadas?**

A arquitetura em camadas permite separar a aplicação em diferentes blocos funcionais, onde cada camada tem um propósito bem definido. Isso melhora a organização do código e facilita a escalabilidade.

Minha estrutura segue essas camadas:

- **Infraestrutura (Infrastructure):** Lida com a configuração do banco de dados e conexões externas.
- **Domínio (Domain):** Contém os repositórios responsáveis pela comunicação com o banco de dados.
- **Aplicação (Application):** Implementa a lógica de negócio e as regras do sistema.
- **Apresentação (Presentation):** Gerencia as requisições HTTP e define os controladores e rotas.
- **Shared (Compartilhado):** Contém middlewares e utilitários usados em diversas partes do sistema.

---

## **Vantagens da Arquitetura em Camadas**

### **1. Separação de Responsabilidades**
Cada camada tem um papel bem definido, evitando código misturado e facilitando a manutenção. Por exemplo, os controladores apenas tratam requisições HTTP e chamam os serviços, que contêm a lógica do sistema.

### **2. Facilidade de Manutenção**
Se precisar modificar a lógica de negócio, posso fazer isso na camada de serviços sem afetar diretamente os controladores ou o banco de dados. Isso torna o código mais modular e fácil de evoluir.

### **3. Reutilização de Código**
Os serviços e repositórios podem ser reutilizados em diferentes partes do sistema sem necessidade de duplicação, tornando o código mais eficiente e limpo.

### **4. Melhor Escalabilidade**
Com essa estrutura, consigo adicionar novas funcionalidades sem bagunçar o código existente. Se precisar mudar a tecnologia do banco de dados, por exemplo, só altero a camada de infraestrutura, sem impactar as outras partes.

### **5. Testabilidade Aprimorada**
Cada camada pode ser testada de forma isolada, permitindo a criação de **testes unitários** para os serviços e repositórios sem depender dos controladores ou do banco de dados.

### **6. Segurança e Controle**
A separação clara das responsabilidades ajuda a implementar medidas de segurança, como middlewares para autenticação e validação de requisições, garantindo que apenas usuários autorizados possam acessar determinadas rotas.

---

## **Conclusão**
A escolha da **Layered Architecture** foi essencial para garantir que o backend fosse escalável, organizado e fácil de manter. Esse modelo me permite adicionar novas funcionalidades sem complicações e facilita o trabalho em equipe caso mais desenvolvedores precisem contribuir para o projeto.

### 1. Estrutura do Frontend - TaskMaster

Para o desenvolvimento do frontend, utilizei o **Next.js** devido à sua eficiência na construção de aplicações React otimizadas e escaláveis. A estrutura do projeto segue um padrão modular que facilita a manutenção e a expansão do sistema.

---

## **2. Organização do Código**

O código-fonte está dentro da pasta `src/`, organizado da seguinte forma:

### **2.1 `app/`** (Páginas e Rotas)
O Next.js usa o sistema de roteamento baseado na estrutura de arquivos. Dentro do diretório `app/`, cada pasta representa uma rota da aplicação:

- **`about/`**: Página de informações sobre o sistema.
- **`login/`**: Tela de autenticação de usuários.
- **`register/`**: Tela de cadastro de novos usuários.
- **`dashboard/`**: Área principal com visão geral e métricas.
- **`painel_adm/`**: Contém páginas administrativas, como:
  - **`cadastro-engenheiros/`**: Cadastro de engenheiros.
  - **`cadastro-tarefas/`**: Cadastro de tarefas.
- **`tarefas/`**: Página para visualizar e gerenciar tarefas.

Cada pasta contém um arquivo `page.tsx`, que representa a página renderizada.

---

### **2.2 `components/`** (Componentes Reutilizáveis)
O diretório `components/` contém elementos reutilizáveis da interface, como:
- **`Navbar.tsx`**: Barra de navegação principal.
- **`Footer.tsx`**: Rodapé da aplicação.
- **`TaskForm.tsx`**: Formulário para criação e edição de tarefas.
- **`TaskList.tsx`**: Lista de tarefas disponíveis.

Os componentes são organizados de forma modular para facilitar a reutilização.

---

### **2.3 `public/`** (Arquivos Estáticos)
- Contém recursos estáticos como `favicon.ico` e estilos globais (`globals.css`).

---

### **2.4 Configurações do Projeto**
Os arquivos de configuração principais incluem:
- **`next.config.js`**: Configuração do Next.js.
- **`tailwind.config.js`**: Configuração do Tailwind CSS.
- **`tsconfig.json`**: Configuração do TypeScript.
- **`.env`**: Variáveis de ambiente.

---

## **3. Por que escolhi essa estrutura?**

1. **Organização Modular**  
   - Separar páginas, componentes e estilos melhora a legibilidade do código.

2. **Next.js para Melhor Performance**  
   - O roteamento baseado em arquivos e a renderização híbrida (SSR/SSG) aumentam a eficiência da aplicação.

3. **Uso de Tailwind CSS**  
   - Permite um desenvolvimento ágil e estilos altamente customizáveis.

4. **Facilidade de Manutenção e Escalabilidade**  
   - O código é organizado para que novas funcionalidades possam ser adicionadas sem comprometer a base existente.

---

## **4. Conclusão**

A escolha dessa estrutura visa manter o frontend do TaskMaster **modular, performático e de fácil manutenção**, permitindo a escalabilidade da aplicação conforme novas funcionalidades forem adicionadas.

### 5. Escolha do Banco de Dados - PostgreSQL

Para o TaskMaster, optei por utilizar **PostgreSQL** como banco de dados relacional devido às suas vantagens em termos de desempenho, confiabilidade e suporte a operações complexas.

---

## **Por que escolhi o PostgreSQL?**

1. **Suporte a Transações Robustas**  
   - O PostgreSQL oferece **controle transacional completo (ACID)**, garantindo consistência e integridade dos dados, algo essencial para a correta alocação de tarefas.

2. **Constraints e Relacionamentos Fortes**  
   - Utiliza **foreign keys, constraints e check constraints**, o que ajuda a manter a integridade referencial e evitar dados inconsistentes.

3. **Eficiência em Consultas Relacionais**  
   - O PostgreSQL é altamente otimizado para **joins complexos e consultas em grandes volumes de dados**, essenciais para o gerenciamento de tarefas e engenheiros no sistema.

4. **Escalabilidade e Segurança**  
   - Com suporte a **índices avançados**, particionamento de tabelas e **armazenamento eficiente**, ele se adapta bem ao crescimento do sistema.

5. **Facilidade de Integração**  
   - PostgreSQL permite fácil integração com APIs e outras ferramentas analíticas, facilitando futuras expansões do TaskMaster.

---

## **Conclusão**

A escolha do PostgreSQL garante que o TaskMaster tenha um banco de dados **seguro, escalável e eficiente**, suportando as necessidades atuais e futuras do projeto.


### 6. Como Iniciar o Projeto - TaskMaster

Este guia explica os passos necessários para rodar o backend e o frontend do **TaskMaster** em **Linux, Mac e Windows**.

---

## **1. Inicializando o Banco de Dados (PostgreSQL)**

O banco de dados está configurado para rodar via **Docker** usando o arquivo `docker-compose.yml` do backend.

### **Passos para todos os sistemas operacionais:**

1. Certifique-se de ter o **Docker** e o **Docker Compose** instalados.
2. No terminal, navegue até a pasta do backend onde está o `docker-compose.yml`.
3. Execute o comando abaixo de acordo com seu sistema operacional:

   **Linux & Mac:**
   ```sh
   docker-compose up -d
   ```

   **Windows (PowerShell):**
   ```powershell
   docker-compose up -d
   ```

4. Após o banco estar rodando, copie o arquivo `init.sql` para dentro do contêiner:

   **Linux, Mac e Windows (PowerShell):**
   ```sh
   docker cp src/infrastructure/database/init.sql taskmaster_db:/init.sql
   ```

5. Acesse o banco de dados manualmente:

   **Linux, Mac e Windows (PowerShell):**
   ```sh
   docker exec -it taskmaster_db psql -U admin -d TaskMaster
   ```

6. Dentro do PostgreSQL, execute o script `init.sql`:
   ```sql
   \i /init.sql
   ```

---

## **2. Configuração das Variáveis de Ambiente**

As variáveis de ambiente já foram disponibilizadas no repositório **GitHub** do projeto.

### **Backend (`.env` do backend)**
O arquivo `.env` do backend deve conter as seguintes configurações:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=TaskMaster

JWT_SECRET=20b3dc34e20762dac596f6af2ec0f9b4def65a88965f380aae3d521e2f7c333db1a0c13c5f2f18adf406b10fd08c68218912e991255d903af14d798dc5d42f48
JWT_EXPIRES_IN=1h
```

### **Frontend (`.env` do frontend)**
O arquivo `.env` do frontend deve conter:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## **3. Rodando o Backend**

1. Certifique-se de que as dependências do backend estão instaladas.
2. No terminal, navegue até a pasta do backend e rode o seguinte comando de acordo com seu sistema operacional:

   **Linux & Mac:**
   ```sh
   cd backend
   npm install
   node src/server.js
   ```

   **Windows (PowerShell ou CMD):**
   ```powershell
   cd backend
   npm install
   node src/server.js
   ```

   O backend rodará na porta `3001`.

---

## **4. Rodando o Frontend**

1. Navegue até a pasta do frontend e depois na task-management-system e instale as dependências.
2. Execute o comando apropriado para seu sistema operacional:

   **Linux & Mac:**
   ```sh
   cd frontend
   cd task-management-system
   npm install
   npm run dev
   ```

   **Windows (PowerShell ou CMD):**
   ```powershell
   cd frontend
   cd task-management-system
   npm install
   npm run dev
   ```

   O frontend estará acessível em `http://localhost:3000`.

---

## **5. Testando a Aplicação**

1. Acesse o frontend no navegador:
   - **URL:** `http://localhost:3000`

2. Para testar a API, use ferramentas como **Postman** ou **Insomnia** para fazer requisições aos endpoints do backend.

3. O banco de dados pode ser acessado via **pgAdmin** ou qualquer outro cliente PostgreSQL usando as credenciais configuradas no `.env`.

---

## **6. Conclusão**

Seguindo esses passos, o **TaskMaster** estará rodando com o banco de dados, backend e frontend funcionando corretamente em **Linux, Mac e Windows**. 🚀
