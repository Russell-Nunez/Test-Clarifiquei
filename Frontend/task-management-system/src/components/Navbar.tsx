"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Aqui você verificaria o estado de autenticação real
    // Por exemplo, checando se existe um token no localStorage
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    // Lógica de logout
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    router.push("/")
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-full mr-3" />
              <span className="font-bold text-xl">TaskMaster</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Início
              </Link>
              {isLoggedIn && (
                <>
                  <Link
                    href="/dashboards"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboards
                  </Link>
                  <Link
                    href="/tarefas"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Tarefas
                  </Link>
                </>
              )}
              <Link
                href="/about"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Sobre
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {isLoggedIn ? (
              <>
                <Button asChild variant="ghost" className="mr-2">
                  <Link href="/painel_adm">Painel Administrativo</Link>
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                  Sair
                </Button>
              </>
            ) : (
              <Button asChild variant="ghost">
                <Link href="/login">Entrar</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

