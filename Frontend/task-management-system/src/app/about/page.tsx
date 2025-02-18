import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClipboardList, Users, BarChart, Target, Code } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Sobre o TaskMaster</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Um sistema avançado de gerenciamento de alocação de tarefas para equipes de engenharia
        </p>
      </div>

      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <ClipboardList className="mr-2" /> Visão Geral
          </CardTitle>
        </CardHeader>
        <CardContent className="text-lg">
          <p>
            TaskMaster é uma plataforma inovadora projetada para otimizar a alocação de trabalho entre engenheiros.
            Nosso objetivo é melhorar a produtividade e o controle das atividades, oferecendo uma interface eficiente
            para registrar, alocar e monitorar o progresso de tarefas, além de gerar relatórios detalhados sobre a
            execução das atividades.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="features" className="mb-12">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="features">Funcionalidades</TabsTrigger>
          <TabsTrigger value="tech">Tecnologias</TabsTrigger>
          <TabsTrigger value="objective">Objetivo</TabsTrigger>
          <TabsTrigger value="benefits">Benefícios</TabsTrigger>
        </TabsList>
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2" /> Funcionalidades Principais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Users className="mr-2 mt-1 h-5 w-5 text-primary" />
                  <div>
                    <strong>Cadastro de Engenheiros:</strong> Gerenciamento de perfis com carga máxima e eficiência.
                  </div>
                </li>
                <li className="flex items-start">
                  <ClipboardList className="mr-2 mt-1 h-5 w-5 text-primary" />
                  <div>
                    <strong>Cadastro de Tarefas:</strong> Registro detalhado com prioridade e tempo estimado.
                  </div>
                </li>
                <li className="flex items-start">
                  <BarChart className="mr-2 mt-1 h-5 w-5 text-primary" />
                  <div>
                    <strong>Alocação Inteligente:</strong> Distribuição otimizada baseada em carga e eficiência.
                  </div>
                </li>
                <li className="flex items-start">
                  <Target className="mr-2 mt-1 h-5 w-5 text-primary" />
                  <div>
                    <strong>Controle de Progresso:</strong> Acompanhamento em tempo real do status das tarefas.
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tech">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="mr-2" /> Tecnologias Utilizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Code className="mr-2 h-5 w-5 text-primary" />
                  <strong>Backend:</strong> Node.js e Express com PostgreSQL
                </li>
                <li className="flex items-center">
                  <Code className="mr-2 h-5 w-5 text-primary" />
                  <strong>Autenticação:</strong> JWT (JSON Web Tokens)
                </li>
                <li className="flex items-center">
                  <Code className="mr-2 h-5 w-5 text-primary" />
                  <strong>Segurança:</strong> Criptografia com bcryptjs
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="objective">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2" /> Nosso Objetivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                O TaskMaster visa proporcionar uma gestão eficiente de tarefas para equipes de engenharia, evitando
                sobrecarga e garantindo entregas pontuais e de qualidade. Nossa plataforma oferece visibilidade em tempo
                real sobre o progresso das tarefas e a capacidade da equipe, potencializando a gestão de projetos e
                elevando a produtividade a novos patamares.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="benefits">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2" /> Benefícios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <BarChart className="mr-2 mt-1 h-5 w-5 text-primary" />
                  <div>
                    <strong>Aumento de Produtividade:</strong> Alocação otimizada de recursos e tarefas.
                  </div>
                </li>
                <li className="flex items-start">
                  <Target className="mr-2 mt-1 h-5 w-5 text-primary" />
                  <div>
                    <strong>Melhoria na Gestão:</strong> Visibilidade clara do progresso e carga de trabalho.
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="mr-2 mt-1 h-5 w-5 text-primary" />
                  <div>
                    <strong>Equilíbrio de Carga:</strong> Distribuição justa de tarefas entre a equipe.
                  </div>
                </li>
                <li className="flex items-start">
                  <ClipboardList className="mr-2 mt-1 h-5 w-5 text-primary" />
                  <div>
                    <strong>Relatórios Detalhados:</strong> Insights valiosos para tomada de decisões.
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

