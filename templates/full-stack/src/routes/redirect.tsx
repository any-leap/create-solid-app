import { createFileRoute } from '@tanstack/solid-router'
import { redirect } from '@tanstack/solid-start'

export const Route = createFileRoute('/redirect')({
  beforeLoad: async () => {
    throw redirect({
      to: '/posts',
    })
  },
})
