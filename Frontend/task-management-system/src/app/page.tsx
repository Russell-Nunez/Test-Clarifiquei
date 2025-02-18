"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Users, BarChart, Shield, Zap } from "lucide-react"
import { useState, useEffect, JSX } from "react"

interface CardProps {
  icon: JSX.Element
  title: string
  description: string
}

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0)
  const images = [
    "carrosel_1.jpg",
    "carrosel_2.jpg",
    "carrosel_3.jpg",
    "carrosel_4.jpg",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          {images.map((src, index) => (
            <Image
              key={src}
              src={`/carrosel/${src}`}  // Caminho atualizado para as imagens na pasta public
              alt={`TaskMaster background ${index + 1}`}
              fill={true}  // Usa "fill" para garantir que a imagem preencha o contêiner
              style={{ objectFit: 'cover' }} // Define o comportamento do object-fit
              className={`transition-opacity duration-1000 ${index === currentImage ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <div className="absolute inset-0 bg-black opacity-50" />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4">Bem-vindo ao TaskMaster</h1>
          <p className="text-xl mb-8">
            Otimize seu fluxo de trabalho, aumente a produtividade e gerencie tarefas com facilidade.
          </p>
          <Button asChild size="lg">
            <Link href="/login">Comece Agora</Link>
          </Button>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Por que escolher o TaskMaster?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<CheckCircle className="w-12 h-12 text-green-500" />}
              title="Gerenciamento Eficiente de Tarefas"
              description="Organize, priorize e acompanhe suas tarefas com nossa interface intuitiva."
            />
            <FeatureCard
              icon={<Users className="w-12 h-12 text-blue-500" />}
              title="Colaboração em Equipe"
              description="Trabalhe perfeitamente com seus colegas de equipe em projetos compartilhados."
            />
            <FeatureCard
              icon={<Clock className="w-12 h-12 text-purple-500" />}
              title="Controle de Tempo"
              description="Monitore o tempo gasto em tarefas e melhore sua produtividade."
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Benefícios do TaskMaster</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<BarChart className="w-12 h-12 text-indigo-500" />}
              title="Aumento de Produtividade"
              description="Nossos usuários relatam um aumento médio de 30% na produtividade após adotar o TaskMaster."
            />
            <BenefitCard
              icon={<Shield className="w-12 h-12 text-red-500" />}
              title="Segurança de Dados"
              description="Seus dados estão seguros conosco. Utilizamos criptografia de ponta a ponta para proteger suas informações."
            />
            <BenefitCard
              icon={<Zap className="w-12 h-12 text-yellow-500" />}
              title="Integração Rápida"
              description="Comece a usar o TaskMaster em minutos. Nossa interface intuitiva permite uma integração rápida e fácil."
            />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">O que nossos clientes dizem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TestimonialCard
              quote="O TaskMaster revolucionou a forma como gerenciamos projetos em nossa empresa. Não consigo imaginar trabalhar sem ele agora."
              author="Maria Silva, CEO da TechInova"
            />
            <TestimonialCard
              quote="A facilidade de uso e as poderosas funcionalidades do TaskMaster o tornam indispensável para nossa equipe de desenvolvimento."
              author="João Santos, CTO da DevPro Solutions"
            />
          </div>
        </div>
      </section>

      <section className="relative bg-gray-800 text-white py-20">
        <div className="absolute inset-0">
          <Image
            src="/logo.jpg"
            alt="Logo Background"
            fill={true}
            style={{ objectFit: 'cover' }}
            className="opacity-30"
          />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">Pronto para aumentar sua produtividade?</h2>
          <p className="text-xl mb-8">
            Junte-se a milhares de usuários satisfeitos e comece a gerenciar suas tarefas de forma eficaz hoje mesmo.
          </p>
          <Button asChild size="lg">
            <Link href="/login">Experimente o TaskMaster Gratuitamente</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: CardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function BenefitCard({ icon, title, description }: CardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-semibold ml-4">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600 italic mb-4">&quot;{quote}&quot;</p>
      <p className="text-right font-semibold">- {author}</p>
    </div>
  )
}
