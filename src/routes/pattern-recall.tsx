import { createFileRoute } from '@tanstack/react-router'
import { PatternRecall } from '../games/pattern-recall/PatternRecall'

export const Route = createFileRoute('/pattern-recall')({
  component: PatternRecall,
})
