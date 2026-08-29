import type { ReactNode } from 'react'
import { SettingsModal } from './SettingsModal'
import { WindowButtons } from './WindowButtons'
import './TitleBar.css'

type TitleBarProps = {
  label: string
  children?: ReactNode
}

function TitleBar({ label, children }: TitleBarProps) {
  return (
    <header className="title-bar">
      <WindowButtons />
      <span className="title-bar__label">{label}</span>
      <div className="game-nav-actions">
        {children}
        <SettingsModal />
      </div>
    </header>
  )
}

export { TitleBar }
export type { TitleBarProps }
