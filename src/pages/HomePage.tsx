import { Link } from '@tanstack/react-router'
import { WindowButtons } from '../components/WindowButtons'

function HomePage() {
  return (
    <main className="page-shell">
      <header className="title-bar">
        <WindowButtons />
        <span className="title-bar__label">GAMES.SECONA.DEV</span>
      </header>

      <section className="hero" aria-labelledby="games-title">
        <h1 id="games-title">GAMES</h1>
      </section>

      <section className="games-grid" aria-label="Games">
        <Link className="game-slot game-slot--pattern" to="/pattern-recall">
          <span className="game-slot__index">01</span>
          <span className="game-slot__name">Pattern Recall</span>
          <span className="game-slot__description">
            Remember the highlighted pattern, then find it again.
          </span>
          <span className="game-slot__action">PLAY ↗</span>
        </Link>
      </section>
    </main>
  )
}

export { HomePage }
