"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardList } from "lucide-react"

// Definir a interface para os dados da tarefa
interface TaskData {
  nome: string
  prioridade: string
  tempo_estimado: number
  engineer_id?: number
}

export default function CadastroTarefas() {
  const [nome, setNome] = useState("")
  const [prioridade, setPrioridade] = useState("")
  const [tempo, setTempo] = useState("")
  const [engineerId, setEngineerId] = useState("")
  const [engenheiros, setEngenheiros] = useState<{ id: number; nome: string }[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  // Carregar engenheiros disponíveis
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Você precisa estar logado para cadastrar tarefas.")
      return
    }

    fetch("http://localhost:3001/api/engineers", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEngenheiros(data)
        } else {
          setError("Erro ao carregar engenheiros.")
        }
      })
      .catch(() => setError("Erro ao carregar engenheiros."))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validações extras antes de enviar
    if (!prioridade) {
      setError("Selecione uma prioridade válida.")
      return
    }

    // Converte tempo para número e remove a unidade "h" se presente
    const tempoNum = parseFloat(tempo.replace('h', '').trim())
    if (isNaN(tempoNum) || tempoNum <= 0) {
      setError("O tempo estimado deve ser um número válido e maior que zero.")
      return
    }

    // Monta o objeto do corpo da requisição com o tipo TaskData
    const taskData: TaskData = {
      nome: nome.trim(),
      prioridade: prioridade.toLowerCase(), // Convertendo para minúsculo
      tempo_estimado: tempoNum, // Passando apenas o número
    }

    // Inclui o engineer_id apenas se um engenheiro foi selecionado
    if (engineerId) {
      taskData.engineer_id = Number(engineerId)
    }

    const token = localStorage.getItem("token")
    if (!token) {
      setError("Você precisa estar logado para cadastrar tarefas.")
      return
    }

    try {
      const response = await fetch("http://localhost:3001/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar tarefa")
      }

      setSuccess("Tarefa cadastrada com sucesso!")
      setTimeout(() => router.push("/tarefas"), 2000)

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Ocorreu um erro inesperado.")
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <ClipboardList className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Cadastro de Tarefas</h1>
          <p className="text-gray-500">Adicione novas tarefas ao sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova Tarefa</CardTitle>
          <CardDescription>Preencha os dados da tarefa para cadastrá-la no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Tarefa</Label>
                <Input
                  id="nome"
                  placeholder="Digite o nome da tarefa"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select
                    value={prioridade}
                    onValueChange={setPrioridade}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Media">Média</SelectItem>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tempo">
                    Tempo Estimado
                    <span className="text-gray-500 text-sm ml-1">(horas)</span>
                  </Label>
                  <Input
                    id="tempo"
                    type="text"
                    placeholder="Ex: 8h"
                    value={tempo}
                    onChange={(e) => setTempo(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="engineerId">Selecione o Engenheiro (Opcional)</Label>
                <Select
                  value={engineerId}
                  onValueChange={setEngineerId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o engenheiro" />
                  </SelectTrigger>
                  <SelectContent>
                    {engenheiros.map((engenheiro) => (
                      <SelectItem key={engenheiro.id} value={engenheiro.id.toString()}>
                        {engenheiro.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg">
                Cadastrar Tarefa
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
