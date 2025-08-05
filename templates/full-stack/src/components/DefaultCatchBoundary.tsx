import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
  useNavigate,
} from '@tanstack/solid-start'
import type { ErrorComponentProps } from '@tanstack/solid-start'
import { Button } from '~/components/ui/Button'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const navigate = useNavigate()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  console.error('DefaultCatchBoundary Error:', error)

  return (
    <div class="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6">
      <ErrorComponent error={error} />
      <div class="flex gap-2 items-center flex-wrap">
        <Button
          onClick={() => {
            router.invalidate()
          }}
          variant="secondary"
          size="sm"
          class="uppercase font-extrabold"
        >
          Try Again
        </Button>
        {isRoot() ? (
          <Link
            to="/"
            class={`px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold`}
          >
            Home
          </Link>
        ) : (
          <Button
            onClick={() => {
              // 尝试导航到父级路由，如果不可用则回到首页
              try {
                navigate({ to: '..' })
              } catch {
                navigate({ to: '/' })
              }
            }}
            variant="secondary"
            size="sm"
            class="uppercase font-extrabold"
          >
            Go Back
          </Button>
        )}
      </div>
    </div>
  )
}
