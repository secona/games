import { Link } from '@tanstack/react-router'
import { TitleBar } from '../components/TitleBar'

function HomePage() {
  return (
    <main className="page-shell">
      <TitleBar label="GAMES.SECONA.DEV" />

      <section className="hero" aria-labelledby="games-title">
        <h1 id="games-title">GAMES</h1>
      </section>

      <section className="games-grid" aria-label="Games">
        <Link className="game-slot game-slot--playable" to="/pattern-recall">
          <span className="game-slot__name">Pattern Recall</span>
          <span className="game-slot__description">
            Remember the highlighted pattern, then find it again.
          </span>
          <span className="game-slot__action">PLAY ↗</span>
        </Link>
        <Link className="game-slot game-slot--playable" to="/pair-hunt">
          <span className="game-slot__name">Pair Hunt</span>
          <span className="game-slot__description">
            Turn the cards and uncover every matching icon pair.
          </span>
          <span className="game-slot__action">PLAY ↗</span>
        </Link>
        <Link className="game-slot game-slot--playable" to="/ricochet">
          <span className="game-slot__name">Ricochet</span>
          <span className="game-slot__description">
            Memorize the angles, then predict the hidden route.
          </span>
          <span className="game-slot__action">PLAY ↗</span>
        </Link>
      </section>
    </main>
  )
}

export { HomePage }
