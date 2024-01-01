import fonts from './fonts.json'
import { ResponsiveLayoutConfig } from '../element'
import { TEXT_WEIGHTS_CONFIG, TextStyleConfig, TextWeightConfig } from '../layout/text-config'

export default fonts

export function getFontWeightAndStyle(variant: string) {
  if (!(variant in TEXT_WEIGHTS_CONFIG)) {
    throw new Error(`Invalid font variant: ${variant}`)
  }
  return TEXT_WEIGHTS_CONFIG[variant as keyof typeof TEXT_WEIGHTS_CONFIG]
}

export function getGoogleFontAxisPropertiesFromWeightAndStyle(config: TextWeightConfig) {
  if (config.italic) {
    return `ital,wght@1,${config.fontWeight}`
  }
  return `wght@${config.fontWeight}`
}

export type FontFamilyData = {
  fontFamily: string
  fontWeight: TextStyleConfig['text']['fontWeight']
}

export function gatherAllFonts(config: Record<string, ResponsiveLayoutConfig>) {
  const allLayout = Object.entries(config)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .flatMap(([_, value]) => Object.values(value))
    .filter(Boolean)
  const fontFamilies = new Set<string>()
  for (const layout of allLayout) {
    if ('text' in layout && 'fontFamily' in layout.text!) {
      fontFamilies.add(
        JSON.stringify({
          fontFamily: layout.text.fontFamily,
          fontWeight: layout.text?.fontWeight ?? 'regular',
        }),
      )
    }
  }
  return Array.from(fontFamilies).map((value) => JSON.parse(value) as FontFamilyData)
}

export function generateGoogleFontsUrl(fontFamilies: FontFamilyData[]) {
  if (fontFamilies.length === 0) {
    return ''
  }

  const baseUrl = 'https://fonts.googleapis.com/css2'
  const params = fontFamilies
    .map(({ fontFamily, fontWeight }) => {
      const config = TEXT_WEIGHTS_CONFIG[fontWeight]
      const axis = getGoogleFontAxisPropertiesFromWeightAndStyle(config)
      return `family=${fontFamily.replace(/ /g, '+')}:${axis}`
    })
    .join('&')
  return `${baseUrl}?${params}`
}
