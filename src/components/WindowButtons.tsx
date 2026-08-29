import './WindowButtons.css'

function WindowButtons() {
  return (
    <div className="window-buttons" aria-hidden="true">
      <span className="window-button window-button--red" />
      <span className="window-button window-button--yellow" />
      <span className="window-button window-button--blue" />
    </div>
  )
}

export { WindowButtons }
