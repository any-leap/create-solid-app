import { createFileRoute } from '@tanstack/solid-router'
import { Button } from "@kobalte/core/button"

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background Pattern */}
      <div class="absolute inset-0" style={{
        'background-image': `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.03'%3E%3Cpath d='M0 40L40 0L80 40L40 80Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div class="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div class="max-w-2xl mx-auto text-center">
          {/* Logo Animation */}
          <div class="mb-8 relative">
            <div class="w-24 h-24 mx-auto mb-6 relative">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl animate-pulse"></div>
              <div class="absolute inset-1 bg-white rounded-xl flex items-center justify-center">
                <span class="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  S
                </span>
              </div>
            </div>
            
            {/* Floating Dots */}
            <div class="absolute -top-2 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
            <div class="absolute -top-4 right-8 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{"animation-delay": "0.5s"}}></div>
            <div class="absolute -bottom-2 left-8 w-4 h-4 bg-indigo-400 rounded-full animate-bounce" style={{"animation-delay": "1s"}}></div>
          </div>

          {/* Main Content */}
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              🚀 <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Solid Start</span>
            </h1>
            
            <p class="text-xl text-gray-600 mb-8 leading-relaxed">
              欢迎使用 <strong>TanStack Solid Start</strong>！
              <br />
              这是一个最小化模板，包含构建现代 Web 应用的所有基础功能。
            </p>

            {/* Feature Grid */}
            <div class="grid grid-cols-2 gap-4 mb-8">
              <FeatureItem icon="⚡" title="极速开发" description="热重载" />
              <FeatureItem icon="🎨" title="现代样式" description="Tailwind CSS" />
              <FeatureItem icon="🔒" title="类型安全" description="TypeScript" />
              <FeatureItem icon="📱" title="响应式" description="移动友好" />
            </div>

            {/* Action Buttons */}
            <div class="space-y-4">
              <Button 
                class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                onClick={() => alert('🎉 欢迎使用 @kobalte/core Button 组件！')}
              >
                🎯 开始开发 (Kobalte Button)
              </Button>
              
              <div class="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  <span>开发服务器就绪</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span>端口</span>
                  <code class="bg-gray-100 px-2 py-1 rounded font-mono text-blue-600">3000</code>
                </div>
              </div>
            </div>

            {/* Quick Start Guide */}
            <div class="mt-8 p-6 bg-gray-50 rounded-2xl border-l-4 border-blue-400">
              <h3 class="font-semibold text-gray-900 mb-3 flex items-center">
                📚 快速开始
              </h3>
              <div class="text-sm text-gray-600 space-y-2">
                <p>1. 编辑 <code class="bg-white px-2 py-1 rounded text-blue-600 font-mono">src/routes/index.tsx</code></p>
                <p>2. 保存文件查看热重载效果</p>
                <p>3. 运行 <code class="bg-white px-2 py-1 rounded text-green-600 font-mono">bun run build</code> 构建生产版本</p>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div class="mt-8 flex justify-center space-x-8 text-sm text-gray-500">
            <a href="https://tanstack.com/start" class="hover:text-blue-600 transition-colors">📖 文档</a>
            <a href="https://github.com" class="hover:text-purple-600 transition-colors">⭐ GitHub</a>
            <a href="#" class="hover:text-indigo-600 transition-colors">🌟 示例</a>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureItem({ icon, title, description }: { icon: string, title: string, description: string }) {
  return (
    <div class="text-center p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:scale-105">
      <div class="text-2xl mb-2">{icon}</div>
      <div class="font-semibold text-gray-900 text-sm">{title}</div>
      <div class="text-xs text-gray-500 mt-1">{description}</div>
    </div>
  )
}