import { z } from 'zod'

export const filterConfig = z
  .object({
    contrast: z.number().min(0).max(200),
    blending: z.enum([
      'normal',
      'multiply',
      'screen',
      'overlay',
      'darken',
      'lighten',
      'color-dodge',
      'color-burn',
      'hard-light',
      'soft-light',
      'difference',
      'exclusion',
      'hue',
      'saturation',
      'color',
      'luminosity',
    ]),
    blur: z.number().min(0).max(100),
    bgBlur: z.number().min(0).max(100),
    brightness: z.number().min(0).max(200),
    grayscale: z.number().min(0).max(200),
    hue: z.number().min(0).max(360),
    invert: z.number().min(0).max(200),
    saturate: z.number().min(0).max(200),
    sepia: z.number().min(0).max(100),
  })
  .partial()

export type FilterConfig = z.infer<typeof filterConfig>

export function generateFilterStyle(config: FilterConfig) {
  const style: React.CSSProperties = {}

  if ('blending' in config) {
    style.mixBlendMode = config.blending
  }

  if ('bgBlur' in config) {
    style.backdropFilter = `blur(${config.bgBlur}px)`
  }

  let filterString = ''

  if ('blur' in config) {
    filterString = `${filterString} blur(${config.blur}px)`
  }

  if ('contrast' in config) {
    filterString = `${filterString} contrast(${config.contrast}%)`
  }
  if ('brightness' in config) {
    filterString = `${filterString} brightness(${config.brightness}%)`
  }
  if ('grayscale' in config) {
    filterString = `${filterString} grayscale(${config.grayscale}%)`
  }
  if ('saturate' in config) {
    filterString = `${filterString} saturate(${config.saturate}%)`
  }
  if ('invert' in config) {
    filterString = `${filterString} invert(${config.invert}%)`
  }
  if ('sepia' in config) {
    filterString = `${filterString} sepia(${config.sepia}%)`
  }
  if ('hue' in config) {
    filterString = `${filterString} hue-rotate(${config.hue}deg)`
  }

  if (filterString) {
    style.filter = filterString
  }

  return style
}
