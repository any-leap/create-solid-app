import { redirect, createFileRoute } from '@tanstack/solid-start'

export const Route = createFileRoute('/redirect')({
  beforeLoad: async () => {
    throw redirect({
      to: '/posts',
    })
  },
})
