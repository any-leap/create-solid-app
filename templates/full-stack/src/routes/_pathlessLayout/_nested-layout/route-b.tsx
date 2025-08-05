import { createFileRoute } from '@tanstack/solid-start'
export const Route = createFileRoute('/_pathlessLayout/_nested-layout/route-b')(
  {
    component: LayoutBComponent,
  },
)

function LayoutBComponent() {
  return <div>I'm B!</div>
}
