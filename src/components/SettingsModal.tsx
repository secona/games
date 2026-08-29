import { Select } from '@base-ui/react/select'
import { Settings } from 'lucide-react'
import { useState } from 'react'
import { THEMES, applyTheme, loadTheme, type ThemeId } from '../theme'
import { Button } from './Button'
import { Modal } from './Modal'
import './SettingsModal.css'

const SELECT_ITEMS = THEMES.map((theme) => ({
  label: theme.label,
  value: theme.id,
}))

function SettingsModal() {
  const [themeId, setThemeId] = useState(loadTheme)

  function selectTheme(nextThemeId: ThemeId | null) {
    if (!nextThemeId) {
      return
    }

    setThemeId(nextThemeId)
    applyTheme(nextThemeId)
  }

  return (
    <Modal
      className="settings-modal"
      closeLabel="Close settings"
      description="Choose a color theme. Changes apply instantly and are saved on this device."
      eyebrow="SYSTEM"
      trigger={
        <Button
          aria-label="Open settings"
          className="settings-trigger"
          title="Settings"
          type="button"
          variant="icon"
        >
          <Settings aria-hidden="true" size={16} strokeWidth={2.4} />
        </Button>
      }
      title="Settings"
    >
      <Select.Root<ThemeId>
        items={SELECT_ITEMS}
        onValueChange={selectTheme}
        value={themeId}
      >
        <Select.Label className="theme-select__label">Color theme</Select.Label>
        <Select.Trigger className="theme-select__trigger">
          <Select.Value />
          <Select.Icon className="theme-select__icon" aria-hidden="true">
            ↓
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Positioner
            align="start"
            alignItemWithTrigger={false}
            className="theme-select__positioner"
            sideOffset={6}
          >
            <Select.Popup className="theme-select__popup">
              <Select.List className="theme-select__list">
                {THEMES.map((theme) => (
                  <Select.Item
                    className="theme-select__item"
                    key={theme.id}
                    label={theme.label}
                    value={theme.id}
                  >
                    <Select.ItemIndicator
                      className="theme-select__indicator"
                      keepMounted
                    >
                      ✓
                    </Select.ItemIndicator>
                    <Select.ItemText className="theme-select__item-text">
                      {theme.label}
                    </Select.ItemText>
                    <span className="theme-swatches" aria-hidden="true">
                      {theme.swatches.map((color) => (
                        <span
                          className="theme-swatch"
                          key={color}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </span>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Modal>
  )
}

export { SettingsModal }
