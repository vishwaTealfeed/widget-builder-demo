import { z } from 'zod'
import { generateInitialSizeConfig, sizeConfig } from './size-config'
import { positionConfig } from './position-config'
import { layoutConfig } from './layout-config'
import { styleConfig } from './style-config'
import { merge } from '../utils'
import { filterConfig } from './filter-config'

export const containerStyleConfig = z.object({
  type: z.literal('container'),
  size: sizeConfig,
  position: positionConfig,
  layout: layoutConfig,
  style: styleConfig,
  filter: filterConfig.optional(),
})
export type ContainerStyleConfig = z.infer<typeof containerStyleConfig>

export function generateInitialContainerStyleConfig(config: Partial<ContainerStyleConfig> = {}): ContainerStyleConfig {
  return merge(
    {
      type: 'container',
      size: {
        width: generateInitialSizeConfig('relative'),
        height: generateInitialSizeConfig('fixed'),
        minMax: [],
      },
      position: {
        type: 'relative',
      },
      layout: {
        type: 'flex',
        direction: 'column',
        alignItems: 'flex-start',
        justifyContent: 'stretch',
        gap: 0,
        wrap: 'nowrap',
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
        background: {
          type: 'color',
          color: '#B3E1FF', // light blue color
          opacity: 50,
        },
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
