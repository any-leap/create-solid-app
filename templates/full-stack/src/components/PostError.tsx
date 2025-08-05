import { ErrorComponent, ErrorComponentProps } from '@tanstack/solid-start'

export function PostErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />
}
