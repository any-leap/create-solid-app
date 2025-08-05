// app.tsx - TanStack Start 入口点
import { createApp } from '@tanstack/solid-start'
import { routeTree } from './routeTree.gen'

export default createApp({
    routeTree,
    // TanStack Start 会自动处理路由器配置
    defaultPreload: 'intent',
    defaultErrorComponent: ({ error }) => (
        <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <h1 class="text-2xl font-bold text-red-600 mb-4">出现错误</h1>
                <p class="text-gray-600 mb-4">{error.message}</p>
                <button
                    onClick={() => window.location.reload()}
                    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    重新加载
                </button>
            </div>
        </div>
    ),
})