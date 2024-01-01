import { z } from 'zod'

export const colorValueConfig = z.object({
  type: z.literal('color'),
  color: z.string(),
  opacity: z.number(),
})

export const gradientStopConfig = z.object({
  color: z.string(),
  position: z.number(),
  opacity: z.number(),
})

export const gradientValueConfig = z
  .object({
    type: z.literal('gradient'),
    stops: z.array(gradientStopConfig),
  })
  .and(
    z.union([
      z.object({
        gradientType: z.literal('linear'),
        angle: z.number(),
      }),
      z.object({
        gradientType: z.literal('radial'),
      }),
    ]),
  )

export const imageValueConfig = z.object({
  type: z.literal('image'),
  url: z.string(),
  backgroundSize: z.enum(['cover', 'contain']),
  backgroundRepeat: z.enum(['no-repeat', 'repeat', 'repeat-x', 'repeat-y']),
  backgroundPosition: z.enum(['top', 'right', 'left', 'bottom', 'center']),
})

export const pickerValueConfig = z.union([colorValueConfig, gradientValueConfig, imageValueConfig])

export type PickerValue = z.infer<typeof pickerValueConfig>
export type ColorValue = z.infer<typeof colorValueConfig>
export type GradientValue = z.infer<typeof gradientValueConfig>
export type GradientStop = z.infer<typeof gradientStopConfig>
export type ImageValue = z.infer<typeof imageValueConfig>
