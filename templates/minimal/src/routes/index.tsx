import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div class="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          🚀 Solid Start
        </h1>
        <p class="text-gray-600 mb-6">
          欢迎使用 TanStack Solid Start！这是一个最小化的模板，包含了构建现代 Web 应用的基础功能。
        </p>
        <div class="space-y-4">
          <div class="p-4 bg-blue-50 rounded-lg">
            <h3 class="font-semibold text-blue-900">✨ 特性</h3>
            <ul class="text-sm text-blue-700 mt-2 space-y-1">
              <li>• TypeScript 支持</li>
              <li>• Tailwind CSS 样式</li>
              <li>• 热重载开发</li>
              <li>• 生产构建优化</li>
            </ul>
          </div>
          <div class="text-sm text-gray-500">
            编辑 <code class="bg-gray-100 px-2 py-1 rounded">src/routes/index.tsx</code> 开始开发
          </div>
        </div>
      </div>
    </div>
  )
}