"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, ClipboardList, TrendingUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Engineer {
  id: number
  nome: string
  carga_maxima: string
  eficiencia: string
}

interface Task {
  id: number
  nome: string
  prioridade: string
  tempo_estimado: string
  status: string
  engineer_id: number | null
}

interface TasksResponse {
  success: boolean
  data: Task[]
}

export default function AdminDashboard() {
  const [engineers, setEngineers] = useState<Engineer[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Envolvendo fetchData com useCallback para evitar re-renderizações desnecessárias
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }

      const [engineersResponse, tasksResponse] = await Promise.all([
        fetch("http://localhost:3001/api/engineers", { headers }),
        fetch("http://localhost:3001/api/tasks", { headers }),
      ])

      if (!engineersResponse.ok) {
        throw new Error(`Failed to fetch engineers: ${engineersResponse.status} ${engineersResponse.statusText}`)
      }
      if (!tasksResponse.ok) {
        throw new Error(`Failed to fetch tasks: ${tasksResponse.status} ${tasksResponse.statusText}`)
      }

      const engineersData: Engineer[] = await engineersResponse.json()
      const tasksResponseData: TasksResponse = await tasksResponse.json()

      setEngineers(engineersData)
      setTasks(tasksResponseData.data)
    } catch (err) {
      if (err instanceof Error && err.message === "No authentication token found") {
        router.push("/login")
      } else {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
        console.error(err)
      }
    } finally {
      setLoading(false)
    }
  }, [router]) // Mantendo router como dependência, pois ele não muda frequentemente

  // useEffect agora inclui fetchData corretamente
  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalEngineers = engineers.length
  const activeTasks = tasks.filter((task) => task.status === "em andamento").length
  const averageEfficiency =
    engineers.length > 0
      ? Math.round(engineers.reduce((sum, eng) => sum + Number.parseInt(eng.eficiencia), 0) / engineers.length)
      : 0

  if (loading) return <div>Carregando...</div>
  if (error)
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">Erro: {error}</p>
        <Button onClick={fetchData}>Tentar Novamente</Button>
      </div>
    )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bem-vindo ao Painel Administrativo</h1>
      <p className="text-lg text-gray-600">Gerencie engenheiros e tarefas do sistema TaskMaster.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Engenheiros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEngineers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Ativas</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiência Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageEfficiency}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/engineers/new">
          <Card>
            <CardHeader>
              <CardTitle>Cadastro de Engenheiros</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Adicione novos engenheiros ao sistema, especificando:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Nome</li>
                <li>Carga máxima de trabalho (em horas)</li>
                <li>Eficiência</li>
              </ul>
            </CardContent>
          </Card>
        </Link>

        <Link href="/tasks/new">
          <Card>
            <CardHeader>
              <CardTitle>Cadastro de Tarefas</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Crie novas tarefas para os engenheiros, incluindo:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Nome da tarefa</li>
                <li>Prioridade (alta, média, baixa)</li>
                <li>Tempo estimado (em horas)</li>
              </ul>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
