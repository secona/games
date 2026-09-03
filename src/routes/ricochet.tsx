import { createFileRoute } from '@tanstack/react-router'
import { Ricochet } from '../games/ricochet/Ricochet'

export const Route = createFileRoute('/ricochet')({
  component: Ricochet,
})
