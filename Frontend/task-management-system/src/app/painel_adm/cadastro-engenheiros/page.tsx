"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function CadastroEngenheiros() {
  const [nome, setNome] = useState("")
  const [cargaMaxima, setCargaMaxima] = useState("")
  const [eficiencia, setEficiencia] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!nome) {
      setError("O nome do engenheiro é obrigatório.")
      return
    }

    if (!cargaMaxima || !eficiencia) {
      setError("A carga máxima e a eficiência são obrigatórias.")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      setError("Você precisa estar logado para cadastrar engenheiros.")
      return
    }

    try {
      const response = await fetch("http://localhost:3001/api/engineers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nome,
          carga_maxima: Number(cargaMaxima),
          eficiencia: Number(eficiencia)
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar engenheiro")
      }

      setSuccess("Engenheiro cadastrado com sucesso!")
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
        <Users className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Cadastro de Engenheiros</h1>
          <p className="text-gray-500">Adicione novos engenheiros ao sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo Engenheiro</CardTitle>
          <CardDescription>Preencha os dados do engenheiro.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Engenheiro</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Digite o nome do engenheiro"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cargaMaxima">
                    Carga Máxima de Trabalho
                    <span className="text-gray-500 text-sm ml-1">(horas)</span>
                  </Label>
                  <Input
                    id="cargaMaxima"
                    type="number"
                    placeholder="Ex: 40"
                    value={cargaMaxima}
                    onChange={(e) => setCargaMaxima(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eficiencia">
                    Eficiência
                    <span className="text-gray-500 text-sm ml-1">(0-100)</span>
                  </Label>
                  <Input
                    id="eficiencia"
                    type="number"
                    placeholder="Ex: 85"
                    min="0"
                    max="100"
                    value={eficiencia}
                    onChange={(e) => setEficiencia(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg">
                Cadastrar Engenheiro
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
