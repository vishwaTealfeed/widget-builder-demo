import { z } from 'zod'
import React from 'react'
import { match } from 'ts-pattern'
import Color from 'color'
import { positionConfig } from './position-config'
import { fillSizeConfig, minMaxConfig, sizeItemConfig } from './size-config'
import { flexLayoutConfig, layoutConfig } from './layout-config'
import { styleConfig, bboxConfig, ShadowConfig } from './style-config'
import { ElementLayoutConfig, ResponsiveLayoutConfig } from '../element'
import { TEXT_WEIGHTS_CONFIG, textConfig } from './text-config'
import { imageConfig, imageRestStyleConfig } from './image-config'
import { iconRestStyleConfig, iconTextConfig } from './icon-config'
import { GradientValue, PickerValue } from './color-config'
import { generateFilterStyle } from './filter-config'
import { Device } from '../devices'
import { merge } from '../utils'

export function generateElementStyle(
  config: ElementLayoutConfig,
  parentConfig?: ElementLayoutConfig,
): React.CSSProperties {
  if (config.style.visible === 'hidden') {
    return {
      display: 'none',
    }
  }

  const FLEX_DIRECTION: Record<
    z.infer<typeof flexLayoutConfig>['direction'],
    { [directionKey: string]: React.CSSProperties['flexDirection'] }
  > = {
    row: {
      reverse: 'row-reverse',
      default: 'row',
    },
    column: {
      reverse: 'column-reverse',
      default: 'column',
    },
  }
  function generateSizeStyle(
    config: z.infer<typeof sizeItemConfig>,
    key: 'width' | 'height',
    parentConfig?: ElementLayoutConfig,
  ) {
    function calculateFillLayout(
      config: z.infer<typeof fillSizeConfig>,
      parentConfig: ElementLayoutConfig,
    ): React.CSSProperties {
      if (parentConfig.type !== 'container') {
        return {}
      }

      switch (parentConfig.layout.type) {
        case 'grid': {
          // TODO: Support grid layout
          return {}
        }

        case 'flex': {
          const elementAxis = key === 'width' ? 'x' : 'y'
          const parentAxis = parentConfig.layout.direction === 'row' ? 'x' : 'y'
          if (elementAxis === parentAxis) {
            return {
              flex: `${config.value ?? 0} 0 0px`,
            }
          }
          return {
            [key]: `${(config.value ?? 0) * 100}%`,
          }
        }
      }
    }

    return match(config)
      .returnType<React.CSSProperties>()
      .with({ type: 'auto' }, () => ({ [key]: 'auto' }))
      .with({ type: 'fill' }, (config) => (parentConfig ? calculateFillLayout(config, parentConfig) : {}))
      .with({ type: 'fixed' }, ({ value }) => ({ [key]: value }))
      .with({ type: 'relative' }, ({ value }) => ({ [key]: `${value}%` }))
      .with({ type: 'viewport' }, ({ value }) => ({
        [key]: `${value}${key === 'width' ? 'vw' : key === 'height' ? 'vh' : ''}`,
      }))
      .exhaustive()
  }
  function generateMinMaxStyle(config: z.infer<typeof minMaxConfig>) {
    function generateSizeValue(config: z.infer<typeof sizeItemConfig>, key: 'width' | 'height') {
      return match(config)
        .returnType<React.CSSProperties['width'] | React.CSSProperties['height']>()
        .with({ type: 'auto' }, () => undefined)
        .with({ type: 'fill' }, () => undefined)
        .with({ type: 'fixed' }, ({ value }) => value ?? undefined)
        .with({ type: 'relative' }, ({ value }) => `${value}%`)
        .with({ type: 'viewport' }, ({ value }) => `${value}${key === 'width' ? 'vw' : key === 'height' ? 'vh' : ''}`)
        .exhaustive()
    }

    return config.reduce((acc, item) => {
      const style = match(item)
        .returnType<React.CSSProperties>()
        .with({ type: 'min-width' }, ({ size }) => ({ minWidth: generateSizeValue(size, 'width') }))
        .with({ type: 'max-width' }, ({ size }) => ({ maxWidth: generateSizeValue(size, 'width') }))
        .with({ type: 'min-height' }, ({ size }) => ({ minHeight: generateSizeValue(size, 'height') }))
        .with({ type: 'max-height' }, ({ size }) => ({ maxHeight: generateSizeValue(size, 'height') }))
        .exhaustive()
      return {
        ...acc,
        ...style,
      }
    }, {} as React.CSSProperties)
  }
  function generatePositionStyle(config: z.infer<typeof positionConfig>) {
    return match(config)
      .returnType<React.CSSProperties>()
      .with({ type: 'relative' }, () => ({ position: 'relative' }))
      .with({ type: 'absolute' }, (config) => ({
        position: 'absolute',
        top: config.top ?? undefined,
        bottom: config.bottom ?? undefined,
        left: config.left ?? undefined,
        right: config.right ?? undefined,
      }))
      .with({ type: 'fixed' }, (config) => ({
        position: 'fixed',
        top: config.top ?? undefined,
        bottom: config.bottom ?? undefined,
        left: config.left ?? undefined,
        right: config.right ?? undefined,
      }))
      .with({ type: 'sticky' }, (config) => ({
        position: 'sticky',
        top: config.top ?? undefined,
        bottom: config.bottom ?? undefined,
        left: config.left ?? undefined,
        right: config.right ?? undefined,
      }))
      .exhaustive()
  }
  function generateLayoutStyle(config: z.infer<typeof layoutConfig>) {
    return match(config)
      .returnType<React.CSSProperties>()
      .with({ type: 'flex' }, (value) => {
        const directionReverse = value.directionReverse ?? false
        const directionKey = directionReverse ? 'reverse' : 'default'
        return {
          display: 'flex',
          flexDirection: FLEX_DIRECTION[value.direction][directionKey],
          alignItems: value.alignItems,
          justifyContent: value.justifyContent,
          flexWrap: value.wrap,
          gap: value.gap || undefined,
        }
      })
      .with({ type: 'grid' }, (value) => ({
        display: 'grid',
        gridTemplateColumns: `repeat(${value.columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${value.rows}, minmax(0, 1fr))`,
        alignItems: value.alignItems,
        gap: value.gap || undefined,
      }))
      .exhaustive()
  }

  function generateGradientValue(value: GradientValue) {
    return match(value)
      .returnType<string>()
      .with({ gradientType: 'linear' }, (value) => {
        const stops = [...value.stops].sort((a, b) => a.position - b.position)
        return `linear-gradient(${value.angle}deg, ${stops
          .map(
            (stop) =>
              `${Color(stop.color)
                .alpha(stop.opacity / 100)
                .rgb()
                .toString()} ${stop.position}%`,
          )
          .join(', ')})`
      })
      .with({ gradientType: 'radial' }, (value) => {
        const stops = [...value.stops].sort((a, b) => a.position - b.position)
        return `radial-gradient(circle, ${stops
          .map(
            (stop) =>
              `${Color(stop.color)
                .alpha(stop.opacity / 100)
                .rgb()
                .toString()} ${stop.position}%`,
          )
          .join(', ')})`
      })
      .exhaustive()
  }
  function generateColorValue(config?: PickerValue) {
    if (typeof config === 'undefined') {
      return undefined
    }

    return match(config)
      .returnType<string | undefined>()
      .with({ type: 'color' }, ({ color, opacity }) =>
        Color(color)
          .alpha(opacity / 100)
          .rgb()
          .toString(),
      )
      .with({ type: 'gradient' }, (value) => generateGradientValue(value))
      .with(
        { type: 'image' },
        ({ url, backgroundRepeat, backgroundSize, backgroundPosition }) =>
          `url("${url}") ${backgroundRepeat} ${backgroundPosition}/${backgroundSize}`,
      )
      .exhaustive()
  }
  function generateShadowStyles(config: ShadowConfig[]) {
    return config
      .map((shadow) => {
        const color = generateColorValue(shadow.color)
        const shadowType = shadow.position === 'inner' ? 'inset ' : ''
        return `${shadowType}${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${color}`
      })
      .join(', ')
  }
  function generateTransformStyles(config: Partial<z.infer<typeof styleConfig>>) {
    if (config.rotation) {
      return `rotate(${config.rotation}deg)`
    }
  }
  function generateMarginStyle(config: z.infer<typeof bboxConfig>): React.CSSProperties {
    return {
      marginTop: config.top ?? undefined,
      marginRight: config.right ?? undefined,
      marginBottom: config.bottom ?? undefined,
      marginLeft: config.left ?? undefined,
    }
  }
  function generatePaddingStyle(config: z.infer<typeof bboxConfig>): React.CSSProperties {
    return {
      paddingTop: config.top ?? undefined,
      paddingRight: config.right ?? undefined,
      paddingBottom: config.bottom ?? undefined,
      paddingLeft: config.left ?? undefined,
    }
  }

  function generateRestStyles(config: z.infer<typeof styleConfig>): React.CSSProperties {
    const style: React.CSSProperties = {
      ...generatePaddingStyle(config.padding),
      ...generateMarginStyle(config.margin),
      opacity: (config.opacity ?? 100) / 100,
      overflow: config.overflow,
      background: generateColorValue(config.background),
      borderTopLeftRadius: config.borderRadius.topLeft || undefined,
      borderTopRightRadius: config.borderRadius.topRight || undefined,
      borderBottomRightRadius: config.borderRadius.bottomRight || undefined,
      borderBottomLeftRadius: config.borderRadius.bottomLeft || undefined,
      borderTopWidth: config.borderWidth.top || undefined,
      borderRightWidth: config.borderWidth.right || undefined,
      borderBottomWidth: config.borderWidth.bottom || undefined,
      borderLeftWidth: config.borderWidth.left || undefined,
      borderColor: config.borderColor ? generateColorValue(config.borderColor) : undefined,
      boxShadow: generateShadowStyles(config.shadows),
      zIndex: config.zIndex || undefined,
      transform: generateTransformStyles({ rotation: config.rotation }) || undefined,
    }

    return style
  }

  function generateImageRestStyles(config: z.infer<typeof imageRestStyleConfig>): React.CSSProperties {
    const style: React.CSSProperties = {
      opacity: (config.opacity ?? 100) / 100,
      borderTopLeftRadius: config.borderRadius.topLeft || undefined,
      borderTopRightRadius: config.borderRadius.topRight || undefined,
      borderBottomRightRadius: config.borderRadius.bottomRight || undefined,
      borderBottomLeftRadius: config.borderRadius.bottomLeft || undefined,
      borderTopWidth: config.borderWidth.top || undefined,
      borderRightWidth: config.borderWidth.right || undefined,
      borderBottomWidth: config.borderWidth.bottom || undefined,
      borderLeftWidth: config.borderWidth.left || undefined,
      borderColor: config.borderColor ? generateColorValue(config.borderColor) : undefined,
      zIndex: config.zIndex || undefined,
      boxShadow: generateShadowStyles(config.shadows),
      transform: generateTransformStyles({ rotation: config.rotation }) || undefined,
    }

    return style
  }

  function generateTextStyles(config: z.infer<typeof textConfig>): React.CSSProperties {
    return {
      fontSize: config.fontSize,
      fontFamily: config.fontFamily,
      lineHeight: config.lineHeight,
      textAlign: config.textAlign,
      fontWeight: TEXT_WEIGHTS_CONFIG[config.fontWeight].fontWeight,
      fontStyle: TEXT_WEIGHTS_CONFIG[config.fontWeight].italic ? 'italic' : undefined,
      letterSpacing: config.letterSpacing,
      color: config.color ? generateColorValue(config.color) : undefined,
      textTransform: config.textTransform,
      textDecoration: config.textDecoration,
    }
  }

  function generateImageStyles(config: z.infer<typeof imageConfig>): React.CSSProperties {
    return {
      objectFit: config.objectFit,
      objectPosition: config.objectPosition,
    }
  }

  function generateIconStyles(config: z.infer<typeof iconTextConfig>) {
    return {
      color: config.color ? generateColorValue(config.color) : undefined,
    }
  }

  function generateIconRestStyles(config: z.infer<typeof iconRestStyleConfig>): React.CSSProperties {
    const style: React.CSSProperties = {
      opacity: (config.opacity ?? 100) / 100,
      zIndex: config.zIndex || undefined,
      boxShadow: generateShadowStyles(config.shadows),
      transform: generateTransformStyles({ rotation: config.rotation }) || undefined,
    }

    return style
  }

  let style: React.CSSProperties = {
    ...generateSizeStyle(config.size.width, 'width', parentConfig),
    ...generateSizeStyle(config.size.height, 'height', parentConfig),
    ...generateMinMaxStyle(config.size.minMax),
    ...generatePositionStyle(config.position),
  }

  if (config.type === 'container') {
    style = {
      ...style,
      ...generateLayoutStyle(config.layout),
      ...generateRestStyles(config.style),
    }
  }

  if (config.type === 'text') {
    style = {
      ...style,
      ...generateTextStyles(config.text),
      ...generateRestStyles(config.style),
      display: 'block',
    }
  }

  if (config.type === 'image') {
    style = {
      ...style,
      ...generateImageStyles(config.image),
      ...generateImageRestStyles(config.style),
      display: 'block',
    }
  }

  if (config.type === 'icon') {
    style = {
      ...style,
      ...generateIconStyles(config.text),
      ...generateIconRestStyles(config.style),
      display: 'block',
    }
  }

  // TODO: Refactor the conditional logic to be more readable
  if (config.filter) {
    style = {
      ...style,
      ...generateFilterStyle(config.filter),
    }
  }

  return style
}

/**
 * This is a mapping of devices to the devices that should be merged for calculating
 * the final layout.
 *
 * For example, if the active device is 'mobile', then the layout of the 'desktop' and 'tablet'
 * as this is how the responsive layout works
 */
export const DEVICES_TO_MERGE: Record<Device, Device[]> = {
  desktop: ['desktop'],
  tablet: ['desktop', 'tablet'],
  mobile: ['desktop', 'tablet', 'mobile'],
}

export function computeFinalLayout(responsiveLayout: ResponsiveLayoutConfig, deviceSize: Device): ElementLayoutConfig {
  const deviceSizesToMerge = DEVICES_TO_MERGE[deviceSize]
  return deviceSizesToMerge.reduce((acc, size) => {
    const deviceLayout = responsiveLayout[size]
    return deviceLayout ? merge(acc, deviceLayout) : acc
  }, {} as ElementLayoutConfig)
}
