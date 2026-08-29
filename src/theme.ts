const THEME_STORAGE_KEY = 'games:theme:v1'
const DEFAULT_THEME = 'monochrome'

const THEMES = [
  {
    id: 'monochrome',
    label: 'Monochrome',
    themeColor: '#e8e8e8',
    swatches: ['#202020', '#707070', '#a4a4a4', '#ffffff'],
  },
  {
    id: 'catppuccin-latte',
    label: 'Catppuccin Latte',
    themeColor: '#8839ef',
    swatches: ['#8839ef', '#ea76cb', '#179299', '#40a02b'],
  },
  {
    id: 'primer-colorblind',
    label: 'Primer Light Colorblind',
    themeColor: '#0969da',
    swatches: ['#0969da', '#1a7f37', '#bf8700', '#bc4c00'],
  },
  {
    id: 'tokyo-night-light',
    label: 'Tokyo Night Light',
    themeColor: '#2959aa',
    swatches: ['#2959aa', '#5a3e8e', '#006c86', '#8c4351'],
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
