"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Clock, User } from "lucide-react"

type Tarefa = {
  id: number
  nome: string
  descricao?: string
  prioridade: "alta" | "media" | "baixa"
  tempo_estimado: string
  status: "pendente" | "em andamento" | "concluída"
  engineer_id: number | null
  created_at: string
  updated_at: string
}

type Engenheiro = {
  id: number
  nome: string
  carga_maxima: string
  eficiencia: string
  created_at: string
  updated_at: string
}

const prioridadeCores = {
  alta: "destructive",
  media: "secondary",
  baixa: "secondary",
} as const

const statusLabels = {
  pendente: "Pendente",
  "em andamento": "Em Andamento",
  concluída: "Concluída",
} as const

export default function TarefasPage() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [engenheiros, setEngenheiros] = useState<Engenheiro[]>([])
  const [tarefaSelecionada, setTarefaSelecionada] = useState<Tarefa | null>(null)
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>("todas")
  const [busca, setBusca] = useState("")
  const [loading, setLoading] = useState(true)
  const [erroTarefas, setErroTarefas] = useState<string | null>(null)
  const [erroEngenheiros, setErroEngenheiros] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Usuário não autenticado. Faça login para continuar.")
        }

        const headers = { Authorization: `Bearer ${token}` }

        const [tarefasResponse, engenheirosResponse] = await Promise.all([
          fetch("http://localhost:3001/api/tasks", { headers }),
          fetch("http://localhost:3001/api/engineers", { headers }),
        ])

        if (!tarefasResponse.ok) throw new Error(`Erro ao buscar tarefas: ${tarefasResponse.status}`)
        if (!engenheirosResponse.ok) throw new Error(`Erro ao buscar engenheiros: ${engenheirosResponse.status}`)

        const tarefasData = await tarefasResponse.json()
        const engenheirosData = await engenheirosResponse.json()

        console.log("Resposta completa da API de tarefas:", tarefasData)
        console.log("Resposta completa da API de engenheiros:", engenheirosData)

        if (tarefasData.success && Array.isArray(tarefasData.data)) {
          setTarefas(tarefasData.data)
        } else {
          console.error("Dados de tarefas inválidos:", tarefasData)
          setErroTarefas("Erro ao carregar as tarefas. Formato de dados inválido.")
        }

        if (Array.isArray(engenheirosData)) {
          setEngenheiros(engenheirosData)
        } else {
          console.error("Dados de engenheiros inválidos:", engenheirosData)
          setErroEngenheiros("Erro ao carregar os engenheiros. Formato de dados inválido.")
        }

        setErroTarefas(null)
        setErroEngenheiros(null)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        if (error instanceof Error) {
          if (error.message.includes("não autenticado")) {
            setErroTarefas(error.message)
          } else if (error.message.includes("tarefas")) {
            setErroTarefas(error.message)
          } else if (error.message.includes("engenheiros")) {
            setErroEngenheiros(error.message)
          } else {
            setErroTarefas("Erro ao carregar os dados.")
          }
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getNomeEngenheiro = (engineerId: number | null) => {
    if (engineerId === null) return "Não atribuído"
    const engenheiro = engenheiros.find((eng) => eng.id === engineerId)
    return engenheiro ? engenheiro.nome : "Não encontrado"
  }

  const tarefasFiltradas = Array.isArray(tarefas)
    ? tarefas.filter((tarefa) => {
        const nomeEngenheiro = getNomeEngenheiro(tarefa.engineer_id)
        const matchBusca =
          (tarefa.nome && tarefa.nome.toLowerCase().includes(busca.toLowerCase())) ||
          (nomeEngenheiro && nomeEngenheiro.toLowerCase().includes(busca.toLowerCase()))
        const matchStatus = filtroStatus === "todos" || tarefa.status === filtroStatus
        const matchPrioridade = filtroPrioridade === "todas" || tarefa.prioridade === filtroPrioridade
        return matchBusca && matchStatus && matchPrioridade
      })
    : []

  const handleAlterarStatus = async (taskId: number, novoStatus: "pendente" | "em andamento" | "concluída") => {
    try {
      const tarefa = tarefas.find((t) => t.id === taskId)
      if (!tarefa) {
        throw new Error("Tarefa não encontrada!")
      }

      if (novoStatus === "em andamento" && tarefa.status !== "pendente") {
        throw new Error('A tarefa precisa estar "Pendente" para ser alterada para "Em Andamento".')
      }

      if (novoStatus === "concluída" && tarefa.status !== "em andamento") {
        throw new Error('A tarefa precisa estar "Em Andamento" para ser concluída.')
      }

      if (novoStatus === "em andamento") {
        const tarefasDoEngenheiro = tarefas.filter(
          (t) => t.engineer_id === tarefa.engineer_id && t.status === "em andamento" && t.id !== taskId,
        )
        if (tarefasDoEngenheiro.length > 0) {
          throw new Error("Este engenheiro já tem uma tarefa em andamento!")
        }
      }

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Usuário não autenticado.")
      }

      const response = await fetch(`http://localhost:3001/api/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: novoStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        const errorMessage = errorData?.message || `Erro ao alterar o status da tarefa: ${response.status}`
        throw new Error(errorMessage)
      }


      // Update the tasks state immutably
      setTarefas((prevTarefas) =>
        prevTarefas.map((t) =>
          t.id === taskId ? { ...t, status: novoStatus, updated_at: new Date().toISOString() } : t,
        ),
      )

      alert("Status da tarefa alterado com sucesso!")
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : "Erro ao alterar o status da tarefa.")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <p>Carregando...</p>
      </div>
    )
  }

  if (erroTarefas || erroEngenheiros) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-red-500">{erroTarefas || erroEngenheiros}</p>
        {erroTarefas?.includes("não autenticado") && (
          <Button className="mt-4" onClick={() => (window.location.href = "/login")}>
            Ir para o Login
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tarefas</h1>
          <p className="text-gray-500">Gerencie e acompanhe todas as tarefas</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar tarefas ou engenheiros..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="em andamento">Em Andamento</SelectItem>
            <SelectItem value="concluída">Concluída</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroPrioridade} onValueChange={setFiltroPrioridade}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as Prioridades</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarefa</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Engenheiro</TableHead>
              <TableHead>Tempo Estimado</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        <Table>
          <TableBody>
            {tarefasFiltradas.map((tarefa) => (
              <TableRow key={`task-${tarefa.id}-${tarefa.status}`}>
                <TableCell>{tarefa.nome}</TableCell>
                <TableCell>
                  <Badge variant={prioridadeCores[tarefa.prioridade]}>{tarefa.prioridade}</Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={tarefa.status}
                    onValueChange={(novoStatus) =>
                      handleAlterarStatus(tarefa.id, novoStatus as "pendente" | "em andamento" | "concluída")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue>{statusLabels[tarefa.status as keyof typeof statusLabels]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="em andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluída">Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{getNomeEngenheiro(tarefa.engineer_id)}</TableCell>
                <TableCell>{tarefa.tempo_estimado}h</TableCell>
                <TableCell>{new Date(tarefa.created_at).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => setTarefaSelecionada(tarefa)}>
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!tarefaSelecionada}
        onOpenChange={(open) => {
          if (!open) setTarefaSelecionada(null)
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          {tarefaSelecionada && (
            <>
              <DialogHeader>
                <DialogTitle>{tarefaSelecionada.nome}</DialogTitle>
                <DialogDescription>Detalhes da tarefa</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Prioridade</Label>
                    <Badge variant={prioridadeCores[tarefaSelecionada.prioridade]} className="mt-1">
                      {tarefaSelecionada.prioridade.charAt(0).toUpperCase() + tarefaSelecionada.prioridade.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant="outline" className="mt-1">
                      {statusLabels[tarefaSelecionada.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Descrição</Label>
                  <p className="text-sm text-gray-500 mt-1">{tarefaSelecionada.descricao || "Sem descrição"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <div>
                      <Label>Engenheiro</Label>
                      <p className="text-sm">{getNomeEngenheiro(tarefaSelecionada.engineer_id)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <div>
                      <Label>Tempo Estimado</Label>
                      <p className="text-sm">{tarefaSelecionada.tempo_estimado} horas</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

