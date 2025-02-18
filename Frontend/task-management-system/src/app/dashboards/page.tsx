"use client"

import { useState, useEffect, useMemo } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Task = {
  task_id: number
  task_name: string
  prioridade: string
  tempo_estimado: number
  status: string
  tempo_estimado_com_eficiencia: number
  tempo_ajustado: number
}

type Allocation = {
  engineer_id: number
  engineer_name: string
  carga_maxima: string
  eficiencia: string
  tasks: Task[]
  total_tempo_estimado_com_eficiencia: string
  total_tempo_ajustado: string
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
]

export default function DashboardPage() {
  const [allocations, setAllocations] = useState<Allocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completionChartType, setCompletionChartType] = useState<"bar" | "pie">("bar")
  const [allocationChartType, setAllocationChartType] = useState<"bar" | "pie">("bar")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No authentication token found")
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }

        const allocationRes = await fetch("http://localhost:3001/api/reports/allocation", { headers })

        if (!allocationRes.ok) {
          throw new Error("Failed to fetch data")
        }

        const allocationData = await allocationRes.json()
        setAllocations(allocationData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredAllocations = useMemo(() => {
    return allocations.filter(
      (allocation) =>
        allocation.engineer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        allocation.tasks.some((task) => task.task_name.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [allocations, searchTerm])

  const formatTooltipValue = (value: number | string) => {
    return `${Number(value).toFixed(2)} min`
  }

  const renderCompletionTimeChart = () => {
    const data = filteredAllocations.map((allocation) => ({
      name: allocation.engineer_name,
      tempo_estimado_com_eficiencia: Number(allocation.total_tempo_estimado_com_eficiencia),
    }))

    switch (completionChartType) {
      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey="tempo_estimado_com_eficiencia"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={formatTooltipValue} />
            <Legend formatter={(value) => `${Number(value).toFixed(2)} min`} />
          </PieChart>
        )
      default:
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={formatTooltipValue} />
            <Legend />
            <Bar dataKey="tempo_estimado_com_eficiencia" fill="#8884d8" name="Tempo Estimado com Eficiência (min)" />
          </BarChart>
        )
    }
  }

  const renderAllocationChart = () => {
    const data = filteredAllocations.map((allocation) => ({
      name: allocation.engineer_name,
      total_tempo_ajustado: Number.parseFloat(allocation.total_tempo_ajustado),
    }))

    switch (allocationChartType) {
      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey="total_tempo_ajustado"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#82ca9d"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${Number(value).toFixed(2)}h`} />
            <Legend formatter={(value) => `${Number(value).toFixed(2)}h`} />
          </PieChart>
        )
      default:
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${Number(value).toFixed(2)}h`} />
            <Legend />
            <Bar dataKey="total_tempo_ajustado" fill="#82ca9d" name="Tempo Total Ajustado (h)" />
          </BarChart>
        )
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">Error: {error}</p>
        {error === "No authentication token found" && (
          <Button onClick={() => (window.location.href = "/login")}>Go to Login</Button>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="mb-6">
        <Label htmlFor="search">Pesquisar</Label>
        <Input
          id="search"
          placeholder="Pesquisar por engenheiro ou tarefa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tempo Estimado de Conclusão por Engenheiro (Considerando Eficiência)</CardTitle>
            <Select value={completionChartType} onValueChange={(value: "bar" | "pie") => setCompletionChartType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de Gráfico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Barra</SelectItem>
                <SelectItem value="pie">Pizza</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {renderCompletionTimeChart()}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Alocação de Tarefas por Engenheiro</CardTitle>
            <Select value={allocationChartType} onValueChange={(value: "bar" | "pie") => setAllocationChartType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de Gráfico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Barra</SelectItem>
                <SelectItem value="pie">Pizza</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {renderAllocationChart()}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes de Alocação por Engenheiro</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Engenheiro</TableHead>
                <TableHead>Tarefas Alocadas</TableHead>
                <TableHead>Total Tempo Ajustado (h)</TableHead>
                <TableHead>Eficiência</TableHead>
                <TableHead>Tempo Estimado de Conclusão (min)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAllocations.map((allocation) => (
                <TableRow key={allocation.engineer_id}>
                  <TableCell>{allocation.engineer_name}</TableCell>
                  <TableCell>
                    {allocation.tasks.map((task, index) => (
                      <span key={task.task_id}>
                        {task.task_name}
                        {index < allocation.tasks.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell>{Number(allocation.total_tempo_ajustado).toFixed(2)}</TableCell>
                  <TableCell>{allocation.eficiencia}%</TableCell>
                  <TableCell>{Number(allocation.total_tempo_estimado_com_eficiencia).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

