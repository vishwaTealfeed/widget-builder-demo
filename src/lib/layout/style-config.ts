import z from 'zod'
import { colorValueConfig, pickerValueConfig } from './color-config'

export const shadowConfig = z.object({
  position: z.enum(['inner', 'outer']),
  color: colorValueConfig,
  x: z.number(),
  y: z.number(),
  blur: z.number(),
  spread: z.number(),
})

export type ShadowConfig = z.infer<typeof shadowConfig>

export const bboxConfig = z.object({
  top: z.number().nullable().optional(),
  right: z.number().nullable().optional(),
  bottom: z.number().nullable().optional(),
  left: z.number().nullable().optional(),
})

export const styleConfig = z.object({
  padding: bboxConfig,
  margin: bboxConfig,
  opacity: z.number().nullable().optional(),
  visible: z.enum(['visible', 'hidden']),
  overflow: z.enum(['visible', 'hidden', 'scroll']),
  background: pickerValueConfig.optional(),
  borderColor: colorValueConfig.optional(),
  borderRadius: z.object({
    topLeft: z.number().nullable().optional(),
    topRight: z.number().nullable().optional(),
    bottomRight: z.number().nullable().optional(),
    bottomLeft: z.number().nullable().optional(),
  }),
  borderWidth: bboxConfig,
  shadows: z.array(shadowConfig),
  zIndex: z.number().nullable().optional(),
  rotation: z.number().nullable().optional(),
})
