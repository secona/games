import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Anchor,
  Apple,
  Bell,
  Bike,
  Bolt,
  Camera,
  Cherry,
  CircleQuestionMark,
  Crown,
  Fish,
  Flower2,
  Ghost,
  KeyRound,
  MoonStar,
  Rocket,
  Skull,
  Star,
  Sun,
  Umbrella,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '../../components/Button'
import { Modal } from '../../components/Modal'
import { WindowButtons } from '../../components/WindowButtons'
import './PairHunt.css'

const ICONS: Array<{ icon: LucideIcon; name: string }> = [
  { icon: Anchor, name: 'Anchor' },
  { icon: Apple, name: 'Apple' },
  { icon: Bell, name: 'Bell' },
  { icon: Bike, name: 'Bike' },
  { icon: Bolt, name: 'Bolt' },
  { icon: Camera, name: 'Camera' },
  { icon: Cherry, name: 'Cherry' },
  { icon: Crown, name: 'Crown' },
  { icon: Fish, name: 'Fish' },
  { icon: Flower2, name: 'Flower' },
  { icon: Ghost, name: 'Ghost' },
  { icon: KeyRound, name: 'Key' },
  { icon: MoonStar, name: 'Moon and star' },
  { icon: Rocket, name: 'Rocket' },
  { icon: Skull, name: 'Skull' },
  { icon: Star, name: 'Star' },
  { icon: Sun, name: 'Sun' },
  { icon: Umbrella, name: 'Umbrella' },
]

type Card = (typeof ICONS)[number] & {
  id: string
}

type Phase = 'idle' | 'playing' | 'resolving' | 'won'

function createDeck() {
  const cards = ICONS.flatMap((symbol) =>
    [0, 1].map((copy) => ({ ...symbol, id: `${symbol.name}-${copy}` })),
  )

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]]
  }

  return cards
}

function PairHunt() {
  const [cards, setCards] = useState<Card[]>(createDeck)
  const [selected, setSelected] = useState<string[]>([])
  const [matched, setMatched] = useState<Set<string>>(() => new Set())
  const [moves, setMoves] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')

  useEffect(() => {
    if (phase !== 'resolving' || selected.length !== 2) {
      return undefined
    }

    const [firstId, secondId] = selected
    const firstCard = cards.find((card) => card.id === firstId)
    const secondCard = cards.find((card) => card.id === secondId)
    const isMatch = firstCard?.name === secondCard?.name

    const timeoutId = window.setTimeout(() => {
      if (isMatch) {
        const nextMatched = new Set(matched)
        nextMatched.add(firstId)
        nextMatched.add(secondId)
        setMatched(nextMatched)
        setPhase(nextMatched.size === cards.length ? 'won' : 'playing')
      } else {
        setPhase('playing')
      }

      setSelected([])
    }, 650)

    return () => window.clearTimeout(timeoutId)
  }, [cards, matched, phase, selected])

  function startGame() {
    setCards(createDeck())
    setSelected([])
    setMatched(new Set())
    setMoves(0)
    setPhase('playing')
  }

  function selectCard(cardId: string) {
    if (
      phase !== 'playing' ||
      selected.includes(cardId) ||
      matched.has(cardId)
    ) {
      return
    }

    if (selected.length === 0) {
      setSelected([cardId])
      return
    }

    setSelected([selected[0], cardId])
    setMoves((currentMoves) => currentMoves + 1)
    setPhase('resolving')
  }

  const status =
    phase === 'idle'
      ? 'Ready to uncover the pairs.'
      : phase === 'won'
        ? `All pairs found in ${moves} moves.`
        : phase === 'resolving'
          ? 'Checking the pair.'
          : selected.length === 1
            ? 'Now find its match.'
            : 'Pick two cards.'

  return (
    <main className="page-shell pair-hunt-page">
      <header className="title-bar">
        <WindowButtons />
        <span className="title-bar__label">GAMES.SECONA.DEV / PAIR HUNT</span>
        <div className="game-nav-actions">
          <Link className="game-back-link" to="/">
            ← HOME
          </Link>
          <Modal
            closeLabel="Close game information"
            description="Turn over two cards at a time and find all eighteen matching icon pairs."
            eyebrow="PAIR HUNT"
            trigger={
              <Button
                aria-label="About Pair Hunt"
                title="About Pair Hunt"
                type="button"
                variant="icon"
              >
                <span aria-hidden="true">i</span>
              </Button>
            }
            title="Pair Hunt"
          >
            <p>Matched cards stay open. Clear the tray in as few moves as possible.</p>
          </Modal>
        </div>
      </header>

      <div className="pair-hunt-content">
        <section className="game-console pair-hunt-console" aria-label="Pair Hunt game">
          <div className="game-console__header">
            <p className="game-status" aria-live="polite">
              {status}
            </p>
            <p className="game-progress">
              {moves.toString().padStart(2, '0')} MOVES
            </p>
          </div>

          <div className="pair-board" role="grid" aria-label="Thirty-six memory cards">
            {cards.map((card, index) => {
              const isSelected = selected.includes(card.id)
              const isMatched = matched.has(card.id)
              const isOpen = isSelected || isMatched
              const isMismatch =
                phase === 'resolving' &&
                selected.length === 2 &&
                cards.find((item) => item.id === selected[0])?.name !==
                  cards.find((item) => item.id === selected[1])?.name
              const Icon = card.icon

              return (
                <Button
                  aria-label={isOpen ? `${card.name}, face up` : `Card ${index + 1}, face down`}
                  className={`pair-card${isOpen ? ' is-open' : ''}${isMatched ? ' is-matched' : ''}${isSelected && isMismatch ? ' is-mismatch' : ''}`}
                  disabled={phase === 'idle' || phase === 'won' || phase === 'resolving' || isMatched}
                  key={card.id}
                  onClick={() => selectCard(card.id)}
                  type="button"
                  variant="tile"
                >
                  <CircleQuestionMark
                    className="pair-card__back"
                    aria-hidden="true"
                    strokeWidth={2.4}
                  />
                  <Icon className="pair-card__icon" aria-hidden="true" strokeWidth={2.4} />
                </Button>
              )
            })}
          </div>

          <Button
            aria-hidden={phase !== 'idle' && phase !== 'won'}
            className={phase !== 'idle' && phase !== 'won' ? 'is-hidden' : undefined}
            disabled={phase !== 'idle' && phase !== 'won'}
            onClick={startGame}
            type="button"
            variant="action"
          >
            {phase === 'idle' ? 'Start hunt' : 'Hunt again'} <span>↗</span>
          </Button>
        </section>
      </div>
    </main>
  )
}

export { PairHunt }
