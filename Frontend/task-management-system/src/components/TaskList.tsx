"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface Task {
  id: number
  title: string
  assignee: string
  status: "Todo" | "In Progress" | "Done"
}

export default function TaskList() {
  const [tasks] = useState<Task[]>([
    { id: 1, title: "Implement login page", assignee: "John Doe", status: "Todo" },
    { id: 2, title: "Design database schema", assignee: "Jane Smith", status: "In Progress" },
    { id: 3, title: "Write API documentation", assignee: "Bob Johnson", status: "Done" },
  ])

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p className="text-sm text-gray-500">Assignee: {task.assignee}</p>
            <p className="text-sm text-gray-500">Status: {task.status}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

