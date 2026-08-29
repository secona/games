import './App.css'

const emptySlots = Array.from({ length: 6 })

function WindowButtons() {
  return (
    <div className="window-buttons" aria-hidden="true">
      <span className="window-button window-button--red" />
      <span className="window-button window-button--yellow" />
      <span className="window-button window-button--green" />
    </div>
  )
}

function App() {
  return (
    <main className="page-shell">
      <header className="title-bar">
        <WindowButtons />
        <span className="title-bar__label">GAMES.SECONA.DEV</span>
        <span className="title-bar__mode">INDEX</span>
      </header>

      <section className="hero" aria-labelledby="games-title">
        <h1 id="games-title">GAMES</h1>
      </section>

      <section className="games-grid" aria-label="Games">
        {emptySlots.map((_, index) => (
          <div className="game-slot" key={index} aria-hidden="true" />
        ))}
      </section>
    </main>
  )
}

export default App
