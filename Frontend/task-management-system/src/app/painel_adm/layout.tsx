import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, ClipboardList, LogOut } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Painel Administrativo</h2>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link href="/painel_adm">
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Visão Geral
              </Button>
            </Link>
            <Link href="/painel_adm/cadastro-engenheiros">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-5 w-5" />
                Cadastro de Engenheiros
              </Button>
            </Link>
            <Link href="/painel_adm/cadastro-tarefas">
              <Button variant="ghost" className="w-full justify-start">
                <ClipboardList className="mr-2 h-5 w-5" />
                Cadastro de Tarefas
              </Button>
            </Link>
          </nav>

          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/login">
                <LogOut className="mr-2 h-5 w-5" />
                Sair
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto p-8">{children}</div>
      </main>
    </div>
  )
}

