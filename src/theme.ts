const THEME_STORAGE_KEY = 'games:theme:v1'
const DEFAULT_THEME = 'arcade'

const THEMES = [
  {
    id: 'arcade',
    label: 'Arcade',
    themeColor: '#ffd400',
    swatches: ['#ffd400', '#008fa8', '#2457d6', '#d81b60'],
  },
  {
    id: 'catppuccin-latte',
    label: 'Catppuccin Latte',
    themeColor: '#1e66f5',
    swatches: ['#1e66f5', '#8839ef', '#179299', '#d20f39'],
  },
  {
    id: 'primer-colorblind',
    label: 'Primer Colorblind',
    themeColor: '#8250df',
    swatches: ['#8250df', '#0969da', '#6639ba', '#bc4c00'],
  },
  {
    id: 'tokyo-night-light',
    label: 'Tokyo Night Light',
    themeColor: '#007197',
    swatches: ['#007197', '#7847bd', '#2e7de9', '#f52a65'],
  },
] as const

type ThemeId = (typeof THEMES)[number]['id']

function isThemeId(value: string | null): value is ThemeId {
  return THEMES.some((theme) => theme.id === value)
}

function loadTheme(): ThemeId {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

    if (isThemeId(storedTheme)) {
      return storedTheme
    }
  } catch {
    // Storage may be disabled; the in-session theme still works.
  }

  const documentTheme = document.documentElement.dataset.theme ?? null
  return isThemeId(documentTheme) ? documentTheme : DEFAULT_THEME
}

function applyTheme(themeId: ThemeId) {
  document.documentElement.dataset.theme = themeId

  const theme = THEMES.find((item) => item.id === themeId)
  const themeColorMeta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  )

  if (theme && themeColorMeta) {
    themeColorMeta.content = theme.themeColor
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeId)
  } catch {
    // Keep the selected theme for this session when storage is unavailable.
  }
}

export { DEFAULT_THEME, THEMES, applyTheme, isThemeId, loadTheme }
export type { ThemeId }
