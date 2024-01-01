import { z } from 'zod'
import { positionConfig } from './position-config'
import { sizeConfig } from './size-config'
import { ImageElementData } from '../element'
import { styleConfig } from './style-config'
import { merge } from '../utils'
import { filterConfig } from './filter-config'

export const imageConfig = z.object({
  objectFit: z.enum(['fill', 'contain', 'cover']),
  objectPosition: z.enum([
    'top left',
    'top center',
    'top right',
    'left',
    'center',
    'right',
    'bottom left',
    'bottom center',
    'bottom right',
  ]),
})

export const imageRestStyleConfig = styleConfig.pick({
  opacity: true,
  borderColor: true,
  borderRadius: true,
  borderWidth: true,
  shadows: true,
  visible: true,
  zIndex: true,
  rotation: true,
})

export const imageStyleConfig = z.object({
  type: z.literal('image'),
  position: positionConfig,
  size: sizeConfig,
  image: imageConfig,
  style: imageRestStyleConfig,
  filter: filterConfig.optional(),
})

export type ImageStyleConfig = z.infer<typeof imageStyleConfig>

export function generateInitialImageStyleConfig(config: Partial<ImageStyleConfig> = {}): ImageStyleConfig {
  return merge(
    {
      type: 'image',
      position: {
        type: 'relative',
      },
      size: {
        width: { type: 'relative', value: 100 },
        height: { type: 'auto' },
        minMax: [],
      },
      image: {
        objectFit: 'cover',
        objectPosition: 'center',
      },
      style: {
        opacity: 100,
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
        shadows: [],
        visible: 'visible',
      },
      filter: {},
    },
    config,
  )
}

export function generateInitialImageData(): ImageElementData {
  return {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1696259141244-650be1219522?auto=format&fit=crop&q=80&w=1974',
  }
}
