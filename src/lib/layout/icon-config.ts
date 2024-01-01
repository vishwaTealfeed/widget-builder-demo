import { z } from 'zod'
import { positionConfig } from './position-config'
import { sizeConfig } from './size-config'
import { textConfig } from './text-config'
import { merge } from '../utils'
import { IconElementData } from '../element'
import { styleConfig } from './style-config'
import { filterConfig } from './filter-config'

export const iconTextConfig = textConfig.pick({
  color: true,
})

export const iconRestStyleConfig = styleConfig.pick({
  opacity: true,
  visible: true,
  shadows: true,
  zIndex: true,
  rotation: true,
})

export const iconStyleConfig = z.object({
  type: z.literal('icon'),
  position: positionConfig,
  size: sizeConfig,
  text: iconTextConfig,
  style: iconRestStyleConfig,
  filter: filterConfig.optional(),
})

export type IconStyleConfig = z.infer<typeof iconStyleConfig>

export function generateInitialIconStyleConfig(config: Partial<IconStyleConfig> = {}): IconStyleConfig {
  return merge(
    {
      type: 'icon',
      position: {
        type: 'relative',
      },
      size: {
        width: { type: 'fixed', value: 20 },
        height: { type: 'fixed', value: 20 },
        minMax: [],
      },
      text: {
        color: {
          type: 'color',
          color: '#000000',
          opacity: 100,
        },
      },
      style: {
        opacity: 100,
        visible: 'visible',
        shadows: [],
      },
      filterConfig: {},
    },
    config,
  )
}

export function generateInitialIconData(): IconElementData {
  return {
    type: 'icon',
    icon: 'home',
  }
}
