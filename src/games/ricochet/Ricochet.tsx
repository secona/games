import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '../../components/Button'
import { Modal } from '../../components/Modal'
import { TitleBar } from '../../components/TitleBar'
import './Ricochet.css'

const GRID_SIZE = 6
const DEFLECTOR_COUNT = 4
const MINIMUM_BOUNCES = 2
const PREVIEW_DURATION = 2600
const RESULT_DURATION = 1200
const BEST_STREAK_STORAGE_KEY = 'games:ricochet-best:v1'

type Direction = 'north' | 'east' | 'south' | 'west'
type Side = Direction
type DeflectorOrientation = 'slash' | 'backslash'
type Phase = 'idle' | 'preview' | 'guessing' | 'correct' | 'lost'

type Gate = {
  side: Side
  index: number
}

type Deflector = {
  row: number
  column: number
  orientation: DeflectorOrientation
}

type Point = {
  x: number
  y: number
}

type TraceResult = {
  exit: Gate
  points: Point[]
  bounceCount: number
}

type Puzzle = {
  entrance: Gate
  deflectors: Deflector[]
  trace: TraceResult
}

const SIDES: Side[] = ['north', 'east', 'south', 'west']
const GATES = SIDES.flatMap((side) =>
  Array.from({ length: GRID_SIZE }, (_, index) => ({ side, index })),
)

const DIRECTION_VECTORS: Record<Direction, { row: number; column: number }> = {
  north: { row: -1, column: 0 },
  east: { row: 0, column: 1 },
  south: { row: 1, column: 0 },
  west: { row: 0, column: -1 },
}

const REFLECTIONS: Record<
  DeflectorOrientation,
  Record<Direction, Direction>
> = {
  slash: {
    north: 'east',
    east: 'north',
    south: 'west',
    west: 'south',
  },
  backslash: {
    north: 'west',
    west: 'north',
    south: 'east',
    east: 'south',
  },
}

function gateKey(gate: Gate) {
  return `${gate.side}-${gate.index}`
}

function gatesMatch(first: Gate, second: Gate) {
  return first.side === second.side && first.index === second.index
}

function getStart(gate: Gate) {
  if (gate.side === 'north') {
    return {
      row: 0,
      column: gate.index,
      direction: 'south' as Direction,
      point: { x: gate.index + 0.5, y: 0 },
    }
  }

  if (gate.side === 'east') {
    return {
      row: gate.index,
      column: GRID_SIZE - 1,
      direction: 'west' as Direction,
      point: { x: GRID_SIZE, y: gate.index + 0.5 },
    }
  }

  if (gate.side === 'south') {
    return {
      row: GRID_SIZE - 1,
      column: gate.index,
      direction: 'north' as Direction,
      point: { x: gate.index + 0.5, y: GRID_SIZE },
    }
  }

  return {
    row: gate.index,
    column: 0,
    direction: 'east' as Direction,
    point: { x: 0, y: gate.index + 0.5 },
  }
}

function getExit(row: number, column: number, direction: Direction): Gate {
  if (direction === 'north') {
    return { side: 'north', index: column }
  }

  if (direction === 'east') {
    return { side: 'east', index: row }
  }

  if (direction === 'south') {
    return { side: 'south', index: column }
  }

  return { side: 'west', index: row }
}

function getExitPoint(exit: Gate): Point {
  if (exit.side === 'north') {
    return { x: exit.index + 0.5, y: 0 }
  }

  if (exit.side === 'east') {
    return { x: GRID_SIZE, y: exit.index + 0.5 }
  }

  if (exit.side === 'south') {
    return { x: exit.index + 0.5, y: GRID_SIZE }
  }

  return { x: 0, y: exit.index + 0.5 }
}

function tracePuzzle(entrance: Gate, deflectors: Deflector[]) {
  const deflectorMap = new Map(
    deflectors.map((deflector) => [
      `${deflector.row}-${deflector.column}`,
      deflector,
    ]),
  )
  const start = getStart(entrance)
  const visitedStates = new Set<string>()
  const hitDeflectors = new Set<string>()
  const points = [start.point]
  let { row, column, direction } = start

  while (
    row >= 0 &&
    row < GRID_SIZE &&
    column >= 0 &&
    column < GRID_SIZE
  ) {
    const stateKey = `${row}-${column}-${direction}`

    if (visitedStates.has(stateKey)) {
      return null
    }

    visitedStates.add(stateKey)
    const cellKey = `${row}-${column}`
    const deflector = deflectorMap.get(cellKey)

    if (deflector) {
      hitDeflectors.add(cellKey)
      points.push({ x: column + 0.5, y: row + 0.5 })
      direction = REFLECTIONS[deflector.orientation][direction]
    }

    const vector = DIRECTION_VECTORS[direction]
    row += vector.row
    column += vector.column
  }

  const previousVector = DIRECTION_VECTORS[direction]
  const lastRow = row - previousVector.row
  const lastColumn = column - previousVector.column
  const exit = getExit(lastRow, lastColumn, direction)
  points.push(getExitPoint(exit))

  return {
    exit,
    points,
    bounceCount: hitDeflectors.size,
  }
}

function shuffledCellIndexes() {
  const indexes = Array.from(
    { length: GRID_SIZE * GRID_SIZE },
    (_, index) => index,
  )

  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[indexes[index], indexes[randomIndex]] = [
      indexes[randomIndex],
      indexes[index],
    ]
  }

  return indexes
}

function createPuzzle(): Puzzle {
  for (let attempt = 0; attempt < 2000; attempt += 1) {
    const entrance = GATES[Math.floor(Math.random() * GATES.length)]
    const deflectors = shuffledCellIndexes()
      .slice(0, DEFLECTOR_COUNT)
      .map((cellIndex) => ({
        row: Math.floor(cellIndex / GRID_SIZE),
        column: cellIndex % GRID_SIZE,
        orientation:
          Math.random() < 0.5
            ? ('slash' as const)
            : ('backslash' as const),
      }))
    const trace = tracePuzzle(entrance, deflectors)

    if (
      trace &&
      trace.bounceCount >= MINIMUM_BOUNCES &&
      !gatesMatch(entrance, trace.exit)
    ) {
      return { entrance, deflectors, trace }
    }
  }

  const entrance = { side: 'west' as const, index: 2 }
  const deflectors: Deflector[] = [
    { row: 2, column: 2, orientation: 'slash' },
    { row: 0, column: 2, orientation: 'backslash' },
    { row: 4, column: 4, orientation: 'slash' },
    { row: 1, column: 5, orientation: 'backslash' },
  ]
  const trace = tracePuzzle(entrance, deflectors)

  if (!trace) {
    throw new Error('The fallback Ricochet puzzle must have a valid path.')
  }

  return { entrance, deflectors, trace }
}

function loadBestStreak() {
  try {
    const storedValue = window.localStorage.getItem(BEST_STREAK_STORAGE_KEY)
    const parsedValue = Number.parseInt(storedValue ?? '', 10)

    return Number.isSafeInteger(parsedValue) && parsedValue >= 0
      ? parsedValue
      : 0
  } catch {
    return 0
  }
}

function saveBestStreak(bestStreak: number) {
  try {
    window.localStorage.setItem(
      BEST_STREAK_STORAGE_KEY,
      bestStreak.toString(),
    )
  } catch {
    // Keep the best streak in memory when storage is unavailable.
  }
}

function gatePositionStyle(gate: Gate) {
  return {
    '--gate-position': `${((gate.index + 0.5) / GRID_SIZE) * 100}%`,
  } as CSSProperties
}

function gateLabel(gate: Gate) {
  return `${gate.side} gate ${gate.index + 1}`
}

function Ricochet() {
  const [bestStreak, setBestStreak] = useState(loadBestStreak)
  const [phase, setPhase] = useState<Phase>('idle')
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [selectedExit, setSelectedExit] = useState<Gate | null>(null)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    if (phase !== 'preview' && phase !== 'correct') {
      return undefined
    }

    const timeoutId = window.setTimeout(
      () => {
        if (phase === 'preview') {
          setPhase('guessing')
          return
        }

        setPuzzle(createPuzzle())
        setSelectedExit(null)
        setPhase('preview')
      },
      phase === 'preview' ? PREVIEW_DURATION : RESULT_DURATION,
    )

    return () => window.clearTimeout(timeoutId)
  }, [phase])

  function startRun() {
    setPuzzle(createPuzzle())
    setSelectedExit(null)
    setStreak(0)
    setPhase('preview')
  }

  function chooseExit(gate: Gate) {
    if (phase !== 'guessing' || !puzzle) {
      return
    }

    setSelectedExit(gate)

    if (!gatesMatch(gate, puzzle.trace.exit)) {
      setPhase('lost')
      return
    }

    const nextStreak = streak + 1
    setStreak(nextStreak)
    setBestStreak((currentBest) => {
      const nextBest = Math.max(currentBest, nextStreak)

      if (nextBest !== currentBest) {
        saveBestStreak(nextBest)
      }

      return nextBest
    })
    setPhase('correct')
  }

  const isResult = phase === 'correct' || phase === 'lost'
  const showDeflectors = phase === 'preview' || isResult
  const pathPoints = puzzle?.trace.points
    .map((point) => `${point.x * 100},${point.y * 100}`)
    .join(' ')
  const status =
    phase === 'idle'
      ? 'Ready to trace the hidden route.'
      : phase === 'preview'
        ? 'Memorize the four deflectors.'
        : phase === 'guessing'
          ? 'The deflectors are hidden. Choose the exit.'
          : phase === 'correct'
            ? 'Correct. Loading the next route.'
            : `Run over. The ball exited through ${puzzle ? gateLabel(puzzle.trace.exit) : 'another gate'}.`

  return (
    <main className="page-shell ricochet-page">
      <TitleBar label="GAMES.SECONA.DEV / RICOCHET">
        <Link className="game-back-link" to="/">
          ← HOME
        </Link>
        <Modal
          closeLabel="Close game information"
          description="Memorize four angled deflectors, then predict where the hidden route will leave the board."
          eyebrow="RICOCHET"
          trigger={
            <Button
              aria-label="About Ricochet"
              title="About Ricochet"
              type="button"
              variant="icon"
            >
              <span aria-hidden="true">i</span>
            </Button>
          }
          title="Ricochet"
        >
          <p>
            The ball travels in a straight line and turns 90° whenever it
            strikes a deflector. One wrong exit ends the run.
          </p>
        </Modal>
      </TitleBar>

      <div className="ricochet-content">
        <section className="game-console ricochet-console" aria-label="Ricochet game">
          <div className="game-console__header">
            <p className="game-status" aria-live="polite">
              {status}
            </p>
            <div className="ricochet-scores" aria-label="Score">
              <p className="game-progress">
                {streak.toString().padStart(2, '0')} STREAK
              </p>
              <p className="ricochet-best">
                BEST {bestStreak.toString().padStart(2, '0')}
              </p>
            </div>
          </div>

          <div
            className={`ricochet-field ricochet-field--${phase}`}
            aria-label="Six by six Ricochet board"
          >
            <div className="ricochet-board">
              {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
                const row = Math.floor(index / GRID_SIZE)
                const column = index % GRID_SIZE
                const deflector = puzzle?.deflectors.find(
                  (item) => item.row === row && item.column === column,
                )

                return (
                  <div className="ricochet-cell" key={index}>
                    {showDeflectors && deflector ? (
                      <span
                        aria-hidden="true"
                        className={`ricochet-deflector ricochet-deflector--${deflector.orientation}`}
                      />
                    ) : null}
                  </div>
                )
              })}

              {isResult && pathPoints ? (
                <svg
                  aria-hidden="true"
                  className="ricochet-trace"
                  viewBox={`0 0 ${GRID_SIZE * 100} ${GRID_SIZE * 100}`}
                >
                  <polyline
                    className="ricochet-trace__line"
                    pathLength="1"
                    points={pathPoints}
                  />
                </svg>
              ) : null}

              {phase === 'idle' ? (
                <p className="ricochet-board__idle">TRACE THE UNSEEN</p>
              ) : null}
            </div>

            {GATES.map((gate) => {
              const isEntrance = puzzle
                ? gatesMatch(gate, puzzle.entrance)
                : false
              const isVisibleEntrance = isEntrance && phase !== 'preview'
              const isCorrectExit =
                isResult && puzzle
                  ? gatesMatch(gate, puzzle.trace.exit)
                  : false
              const isWrongExit =
                phase === 'lost' && selectedExit
                  ? gatesMatch(gate, selectedExit)
                  : false

              return (
                <Button
                  aria-label={
                    isVisibleEntrance
                      ? `Ball entrance, ${gateLabel(gate)}`
                      : `Choose ${gateLabel(gate)}`
                  }
                  aria-pressed={
                    selectedExit ? gatesMatch(gate, selectedExit) : false
                  }
                  className={`ricochet-gate ricochet-gate--${gate.side}${isVisibleEntrance ? ' is-entrance' : ''}${isCorrectExit ? ' is-correct' : ''}${isWrongExit ? ' is-wrong' : ''}`}
                  disabled={phase !== 'guessing' || isEntrance}
                  key={gateKey(gate)}
                  onClick={() => chooseExit(gate)}
                  style={gatePositionStyle(gate)}
                  type="button"
                  variant="tile"
                >
                  {isVisibleEntrance ? (
                    <span className="ricochet-ball" aria-hidden="true" />
                  ) : null}
                  {isCorrectExit ? (
                    <span className="ricochet-gate__mark" aria-hidden="true">
                      ✓
                    </span>
                  ) : null}
                  {isWrongExit ? (
                    <span className="ricochet-gate__mark" aria-hidden="true">
                      ×
                    </span>
                  ) : null}
                </Button>
              )
            })}
          </div>

          <Button
            aria-hidden={phase !== 'idle' && phase !== 'lost'}
            className={phase !== 'idle' && phase !== 'lost' ? 'is-hidden' : undefined}
            disabled={phase !== 'idle' && phase !== 'lost'}
            onClick={startRun}
            type="button"
            variant="action"
          >
            {phase === 'idle' ? 'Start tracing' : 'New run'} <span>↗</span>
          </Button>
        </section>
      </div>
    </main>
  )
}

export { Ricochet }
