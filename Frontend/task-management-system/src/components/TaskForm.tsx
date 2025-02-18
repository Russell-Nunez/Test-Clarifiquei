"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TaskForm() {
  const [title, setTitle] = useState("")
  const [assignee, setAssignee] = useState("")
  const [status, setStatus] = useState("Todo")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement task creation logic
    console.log("New task:", { title, assignee, status })
    setTitle("")
    setAssignee("")
    setStatus("Todo")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="assignee">Assignee</Label>
        <Input id="assignee" value={assignee} onChange={(e) => setAssignee(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todo">Todo</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Add Task</Button>
    </form>
  )
}

