import './App.css'
import { PatternRecall } from './games/pattern-recall/PatternRecall'

function WindowButtons() {
  return (
    <div className="window-buttons" aria-hidden="true">
      <span className="window-button window-button--red" />
      <span className="window-button window-button--yellow" />
      <span className="window-button window-button--green" />
    </div>
  )
}

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
        <a className="game-slot game-slot--pattern" href="/pattern-recall/">
          <span className="game-slot__index">01</span>
          <span className="game-slot__name">Pattern Recall</span>
          <span className="game-slot__description">
            Remember the highlighted pattern, then find it again.
          </span>
          <span className="game-slot__action">PLAY ↗</span>
        </a>
      </section>
    </main>
  )
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  if (path === '/pattern-recall') {
    return <PatternRecall />
  }

  return <HomePage />
}

export default App
