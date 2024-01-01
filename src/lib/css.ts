import { createHooks, recommended } from '@css-hooks/react'
import { DEVICE_CONFIG } from './devices'

const [globalStyles, css] = createHooks({
  ...recommended,
  tablet: `@media (min-width: ${DEVICE_CONFIG.tablet.deviceSize}px)`,
  desktop: `@media (min-width: ${DEVICE_CONFIG.desktop.deviceSize}px)`,
})

export { css, globalStyles }
