// app.tsx - TanStack Start 入口点
import { createApp, useRouter } from '@tanstack/solid-start'
import { routeTree } from './routeTree.gen'

// 错误组件 - 需要单独定义以便使用 hooks
function DefaultErrorComponent({ error }: { error: Error }) {
    const router = useRouter()

    return (
        <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <h1 class="text-2xl font-bold text-red-600 mb-4">出现错误</h1>
                <p class="text-gray-600 mb-4">{error.message}</p>
                <button
                    onClick={() => {
                        // 使用路由器的 invalidate 方法重新加载当前路由数据
                        // 这比 window.location.reload() 更好，因为不会重新加载整个页面
                        router.invalidate()
                    }}
                    class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                    重新加载
                </button>
            </div>
        </div>
    )
}

export default createApp({
    routeTree,
    // TanStack Start 会自动处理路由器配置
    defaultPreload: 'intent',
    defaultErrorComponent: DefaultErrorComponent,
})