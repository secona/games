import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Modal } from '../../components/Modal'
import './PatternRecall.css'

const GRID_SIZE = 5
const TILE_COUNT = GRID_SIZE * GRID_SIZE
const TARGET_COUNT = 6
const REVEAL_DURATION = 2600

type Phase = 'idle' | 'revealing' | 'recall' | 'won' | 'lost'

function createPattern() {
  const positions = Array.from({ length: TILE_COUNT }, (_, index) => index)

  for (let index = positions.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[positions[index], positions[randomIndex]] = [
      positions[randomIndex],
      positions[index],
    ]
  }

  return new Set(positions.slice(0, TARGET_COUNT))
}

function WindowButtons() {
  return (
    <div className="window-buttons" aria-hidden="true">
      <span className="window-button window-button--red" />
      <span className="window-button window-button--yellow" />
      <span className="window-button window-button--green" />
    </div>
  )
}

function PatternRecall() {
  const [pattern, setPattern] = useState<Set<number>>(() => new Set())
  const [selected, setSelected] = useState<Set<number>>(() => new Set())
  const [phase, setPhase] = useState<Phase>('idle')

  useEffect(() => {
    if (phase !== 'revealing') {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setPhase('recall')
    }, REVEAL_DURATION)

    return () => window.clearTimeout(timeoutId)
  }, [phase])

  function startRound() {
    setPattern(createPattern())
    setSelected(new Set())
    setPhase('revealing')
  }

  function selectTile(index: number) {
    if (phase !== 'recall' || selected.has(index)) {
      return
    }

    if (!pattern.has(index)) {
      setPhase('lost')
      return
    }

    const nextSelected = new Set(selected)
    nextSelected.add(index)
    setSelected(nextSelected)

    if (nextSelected.size === TARGET_COUNT) {
      setPhase('won')
    }
  }

  const isGameOver = phase === 'won' || phase === 'lost'
  const status =
    phase === 'idle'
      ? 'Ready when you are.'
      : phase === 'revealing'
        ? 'Memorize the pattern.'
        : phase === 'recall'
          ? 'Recall the highlighted tiles.'
          : phase === 'won'
            ? 'Pattern recalled.'
            : 'That tile was not part of the pattern.'

  return (
    <main className="page-shell pattern-recall-page">
      <header className="title-bar">
        <WindowButtons />
        <span className="title-bar__label">GAMES.SECONA.DEV / PATTERN RECALL</span>
        <div className="game-nav-actions">
          <Link className="game-back-link" to="/">
            ← HOME
          </Link>
          <Modal
            closeLabel="Close game information"
            description="Watch the six highlighted tiles, then find them again after the pattern disappears."
            eyebrow="MEMORY TEST / 01"
            trigger={
              <button
                aria-label="About Pattern Recall"
                className="game-info-button"
                title="About Pattern Recall"
                type="button"
              >
                <span aria-hidden="true">i</span>
              </button>
            }
            title="Pattern Recall"
          >
            <p>Pick every matching tile to win. One wrong choice ends the round.</p>
          </Modal>
        </div>
      </header>

      <div className="pattern-recall-content">
        <section className="game-console" aria-label="Pattern Recall game">
          <div className="game-console__header">
            <p className="game-status" aria-live="polite">
              {status}
            </p>
            <p className="game-progress">
              {selected.size.toString().padStart(2, '0')} /{' '}
              {TARGET_COUNT.toString().padStart(2, '0')}
            </p>
          </div>

          <div className="memory-board" role="grid" aria-label="5 by 5 memory board">
            {Array.from({ length: TILE_COUNT }, (_, index) => {
              const isRevealed = phase === 'revealing' && pattern.has(index)
              const isAnswer = phase === 'lost' && pattern.has(index)
              const isSelected = selected.has(index)

              return (
                <button
                  className={`memory-tile${isRevealed ? ' is-revealed' : ''}${isAnswer ? ' is-answer' : ''}${isSelected ? ' is-selected' : ''}`}
                  disabled={phase !== 'recall'}
                  key={index}
                  onClick={() => selectTile(index)}
                  type="button"
                  aria-label={`Tile ${index + 1}${isRevealed || isAnswer ? ', highlighted' : ''}`}
                  aria-pressed={isSelected}
                />
              )
            })}
          </div>

          <button
            aria-hidden={!isGameOver && phase !== 'idle'}
            className={`game-action${!isGameOver && phase !== 'idle' ? ' is-hidden' : ''}`}
            disabled={!isGameOver && phase !== 'idle'}
            onClick={startRound}
            type="button"
          >
            {phase === 'idle' ? 'Start round' : 'Play again'} <span>↗</span>
          </button>
        </section>
      </div>

    </main>
  )
}

export { PatternRecall }
