import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div class="absolute inset-0 opacity-40" style={{
        'background-image': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='6' cy='6' r='6'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Navigation */}
      <nav class="relative z-10 flex items-center justify-between p-6 lg:px-8">
        <div class="flex items-center">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">S</span>
            </div>
            <span class="text-white font-semibold text-xl">SolidApp</span>
          </div>
        </div>
        <div class="hidden md:flex items-center space-x-6">
          <a href="/posts" class="text-gray-300 hover:text-white transition-colors">Posts</a>
          <a href="/users" class="text-gray-300 hover:text-white transition-colors">Users</a>
          <button class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div class="relative z-10 flex items-center justify-center min-h-[80vh] px-6">
        <div class="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div class="mb-8">
            <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Build{' '}
              <span class="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                Amazing
              </span>
              <br />
              Full-Stack Apps
            </h1>
            <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              基于 TanStack Solid Start 构建的现代化全栈应用脚手架，
              包含数据库、认证、API 和部署配置。
            </p>
          </div>

          {/* Feature Cards */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <FeatureCard 
              icon="⚡" 
              title="极速性能" 
              description="基于 Solid.js 的响应式框架"
              gradient="from-yellow-400 to-orange-500"
            />
            <FeatureCard 
              icon="🛡️" 
              title="类型安全" 
              description="端到端 TypeScript 支持"
              gradient="from-blue-400 to-purple-500"
            />
            <FeatureCard 
              icon="🚀" 
              title="开箱即用" 
              description="数据库、认证、Docker 全配置"
              gradient="from-green-400 to-blue-500"
            />
          </div>

          {/* CTA Buttons */}
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              开始构建 🚀
            </button>
            <button class="border border-gray-500 text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300">
              查看文档
            </button>
          </div>

          {/* Tech Stack */}
          <div class="mt-16">
            <p class="text-gray-400 text-sm mb-6">强大的技术栈</p>
            <div class="flex flex-wrap justify-center items-center gap-8 opacity-70">
              <TechIcon name="Solid.js" />
              <TechIcon name="TypeScript" />
              <TechIcon name="Tailwind" />
              <TechIcon name="Drizzle" />
              <TechIcon name="Docker" />
              <TechIcon name="Vite" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div class="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>
  )
}

function FeatureCard({ icon, title, description, gradient }: { 
  icon: string, 
  title: string, 
  description: string,
  gradient: string 
}) {
  return (
    <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
      <div class={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center text-2xl mb-4 mx-auto`}>
        {icon}
      </div>
      <h3 class="text-white font-semibold text-lg mb-2">{title}</h3>
      <p class="text-gray-300 text-sm">{description}</p>
    </div>
  )
}

function TechIcon({ name }: { name: string }) {
  return (
    <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
      <span class="text-gray-300 text-sm font-medium">{name}</span>
    </div>
  )
}