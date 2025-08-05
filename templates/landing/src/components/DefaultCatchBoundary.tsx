import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
  useNavigate,
} from '@tanstack/solid-start'
import type { ErrorComponentProps } from '@tanstack/solid-start'
import { Show, createSignal, onMount } from 'solid-js'
import { isServer } from 'solid-js/web'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const [isClient, setIsClient] = createSignal(false)

  onMount(() => {
    setIsClient(true)
  })

  console.error('DefaultCatchBoundary Error:', error)

  return (
    <div class="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6">
      <ErrorComponent error={error} />
      
      <Show 
        when={!isServer && isClient()} 
        fallback={
          <div class="flex gap-2 items-center flex-wrap">
            <a
              href="/"
              class="px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold"
            >
              回到首页
            </a>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.reload()
                }
              }}
              class="px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold"
            >
              刷新页面
            </button>
          </div>
        }
      >
        <ClientErrorActions />
      </Show>
    </div>
  )
}

function ClientErrorActions() {
  const router = useRouter()
  const navigate = useNavigate()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  return (
    <div class="flex gap-2 items-center flex-wrap">
      <button
        onClick={() => {
          router.invalidate()
        }}
        class="px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold"
      >
        Try Again
      </button>
      {isRoot() ? (
        <Link
          to="/"
          class="px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold"
        >
          Home
        </Link>
      ) : (
        <button
          onClick={() => {
            // 尝试导航到父级路由，如果不可用则回到首页
            try {
              navigate({ to: '..' })
            } catch {
              navigate({ to: '/' })
            }
          }}
          class="px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold"
        >
          Go Back
        </button>
      )}
    </div>
  )
}
