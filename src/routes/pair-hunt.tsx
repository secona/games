import { createFileRoute } from '@tanstack/react-router'
import { PairHunt } from '../games/pair-hunt/PairHunt'

export const Route = createFileRoute('/pair-hunt')({
  component: PairHunt,
})
