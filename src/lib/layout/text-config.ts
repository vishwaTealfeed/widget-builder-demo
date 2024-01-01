import { z } from 'zod'
import { positionConfig } from './position-config'
import { sizeConfig } from './size-config'
import { styleConfig } from './style-config'
import { TextElementData } from '../element'
import { merge } from '../utils'
import { colorValueConfig } from './color-config'
import { filterConfig } from './filter-config'

export const textConfig = z.object({
  fontSize: z.number(),
  lineHeight: z.number(),
  letterSpacing: z.number(),
  textAlign: z.enum(['left', 'center', 'right', 'justify']),
  fontWeight: z.enum([
    'thin',
    'thin-italic',
    'extra-light',
    'extra-light-italic',
    'light',
    'light-italic',
    'regular',
    'italic',
    'medium',
    'medium-italic',
    'semibold',
    'semibold-italic',
    'bold',
    'bold-italic',
    'extra-bold',
    'extra-bold-italic',
    'black',
    'black-italic',
  ]),
  fontFamily: z.string(),
  color: colorValueConfig,
  textTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']),
  textDecoration: z.enum(['none', 'underline', 'line-through']),
})

export type TextConfig = z.infer<typeof textConfig>

export type TextWeight = TextConfig['fontWeight']

export type TextWeightConfig = { name: string; fontWeight: number; italic: boolean }

export const TEXT_WEIGHTS_CONFIG: Record<TextWeight, TextWeightConfig> = {
  thin: {
    name: 'Thin',
    fontWeight: 100,
    italic: false,
  },
  'thin-italic': {
    name: 'Thin Italic',
    fontWeight: 100,
    italic: true,
  },
  'extra-light': {
    name: 'Extra Light',
    fontWeight: 200,
    italic: false,
  },
  'extra-light-italic': {
    name: 'Extra Light Italic',
    fontWeight: 200,
    italic: true,
  },
  light: {
    name: 'Light',
    fontWeight: 300,
    italic: false,
  },
  'light-italic': {
    name: 'Light Italic',
    fontWeight: 300,
    italic: true,
  },
  regular: {
    name: 'Regular',
    fontWeight: 400,
    italic: false,
  },
  italic: {
    name: 'Italic',
    fontWeight: 400,
    italic: true,
  },
  medium: {
    name: 'Medium',
    fontWeight: 500,
    italic: false,
  },
  'medium-italic': {
    name: 'Medium Italic',
    fontWeight: 500,
    italic: true,
  },
  semibold: {
    name: 'Semibold',
    fontWeight: 600,
    italic: false,
  },
  'semibold-italic': {
    name: 'Semibold Italic',
    fontWeight: 600,
    italic: true,
  },
  bold: {
    name: 'Bold',
    fontWeight: 700,
    italic: false,
  },
  'bold-italic': {
    name: 'Bold Italic',
    fontWeight: 700,
    italic: true,
  },
  'extra-bold': {
    name: 'Extra Bold',
    fontWeight: 800,
    italic: false,
  },
  'extra-bold-italic': {
    name: 'Extra Bold Italic',
    fontWeight: 800,
    italic: true,
  },
  black: {
    name: 'Black',
    fontWeight: 900,
    italic: false,
  },
  'black-italic': {
    name: 'Black Italic',
    fontWeight: 900,
    italic: true,
  },
}

export const textStyleConfig = z.object({
  type: z.literal('text'),
  position: positionConfig,
  size: sizeConfig,
  text: textConfig,
  style: styleConfig,
  filter: filterConfig.optional(),
})

export type TextStyleConfig = z.infer<typeof textStyleConfig>

export function generateInitialTextStyleConfig(config: Partial<TextStyleConfig> = {}): TextStyleConfig {
  return merge(
    {
      type: 'text',
      position: {
        type: 'relative',
      },
      size: {
        width: { type: 'relative', value: 100 },
        height: { type: 'auto' },
        minMax: [],
      },
      text: {
        fontSize: 16,
        lineHeight: 1,
        textAlign: 'left',
        fontFamily: 'Inter',
        fontWeight: 'regular',
        letterSpacing: 0,
        color: {
          type: 'color',
          color: '#000000',
          opacity: 100,
        },
        textTransform: 'none',
        textDecoration: 'none',
      },
      style: {
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
        opacity: 100,
        background: undefined,
        borderColor: undefined,
        borderWidth: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
        borderRadius: {
          topLeft: 0,
          topRight: 0,
          bottomRight: 0,
          bottomLeft: 0,
        },
        overflow: 'visible',
        shadows: [],
        visible: 'visible',
      },
      filter: {},
    },
    config,
  )
}

export function generateInitialTextData(): TextElementData {
  return {
    type: 'text',
    text: 'Enter your text here',
  }
}
