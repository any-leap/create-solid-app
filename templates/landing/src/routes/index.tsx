import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div class="min-h-screen bg-white">
      {/* Header */}
      <header class="px-4 lg:px-6 h-14 flex items-center border-b">
        <div class="flex items-center justify-center">
          <span class="font-bold text-xl">🚀 SolidApp</span>
        </div>
        <nav class="ml-auto flex gap-4 sm:gap-6">
          <a class="text-sm font-medium hover:underline underline-offset-4" href="#features">
            特性
          </a>
          <a class="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            价格
          </a>
          <a class="text-sm font-medium hover:underline underline-offset-4" href="#contact">
            联系
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section class="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div class="container px-4 md:px-6 mx-auto">
          <div class="flex flex-col items-center space-y-4 text-center">
            <div class="space-y-2">
              <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                构建现代化的 Web 应用
              </h1>
              <p class="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                使用 TanStack Solid Start 快速构建高性能、类型安全的全栈应用程序
              </p>
            </div>
            <div class="space-x-4">
              <button class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                立即开始
              </button>
              <button class="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                了解更多
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" class="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div class="container px-4 md:px-6 mx-auto">
          <div class="flex flex-col items-center justify-center space-y-4 text-center">
            <div class="space-y-2">
              <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">为什么选择我们？</h2>
              <p class="max-w-[900px] text-gray-500 md:text-xl">
                我们提供完整的解决方案，让您专注于业务逻辑
              </p>
            </div>
          </div>
          <div class="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            <FeatureCard 
              icon="⚡"
              title="极速性能"
              description="基于 Solid.js 和 Vite，提供闪电般的开发体验和运行时性能"
            />
            <FeatureCard 
              icon="🛡️"
              title="类型安全"
              description="端到端的 TypeScript 支持，在编译时发现错误，提高代码质量"
            />
            <FeatureCard 
              icon="🚀"
              title="快速部署"
              description="一键部署到各大云平台，支持 Vercel、Netlify 等"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="w-full py-12 md:py-24 lg:py-32">
        <div class="container px-4 md:px-6 mx-auto">
          <div class="flex flex-col items-center justify-center space-y-4 text-center">
            <div class="space-y-2">
              <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">
                准备开始了吗？
              </h2>
              <p class="max-w-[600px] text-gray-500 md:text-xl">
                加入数千名开发者，开始构建下一代 Web 应用
              </p>
            </div>
            <div class="w-full max-w-sm space-y-2">
              <div class="flex space-x-2">
                <input 
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="输入您的邮箱"
                  type="email"
                />
                <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  订阅
                </button>
              </div>
              <p class="text-xs text-gray-500">
                订阅即表示您同意我们的条款和隐私政策
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer class="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p class="text-xs text-gray-500">© 2024 SolidApp. 保留所有权利。</p>
        <nav class="sm:ml-auto flex gap-4 sm:gap-6">
          <a class="text-xs hover:underline underline-offset-4" href="#">服务条款</a>
          <a class="text-xs hover:underline underline-offset-4" href="#">隐私政策</a>
        </nav>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div class="flex flex-col items-center space-y-2 border border-gray-200 p-6 rounded-lg bg-white">
      <div class="text-4xl">{icon}</div>
      <h3 class="text-xl font-bold">{title}</h3>
      <p class="text-sm text-gray-500 text-center">{description}</p>
    </div>
  )
}