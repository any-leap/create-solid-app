import { ErrorComponent, ErrorComponentProps } from '@tanstack/solid-start'

export function UserErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />
}
