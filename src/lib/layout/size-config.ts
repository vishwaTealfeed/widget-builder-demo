import { match } from 'ts-pattern'
import { z } from 'zod'

export const fillSizeConfig = z.object({
  type: z.literal('fill'),
  value: z.number().nullable().optional(),
})
export const fixedSizeConfig = z.object({
  type: z.literal('fixed'),
  value: z.number().nullable().optional(),
})
export const relativeSizeConfig = z.object({
  type: z.literal('relative'),
  value: z.number().nullable().optional(),
})
export const viewportSizeConfig = z.object({
  type: z.literal('viewport'),
  value: z.number().nullable().optional(),
})
export const autoSizeConfig = z.object({
  type: z.literal('auto'),
})
export const sizeItemConfig = z.discriminatedUnion('type', [
  fillSizeConfig,
  fixedSizeConfig,
  relativeSizeConfig,
  viewportSizeConfig,
  autoSizeConfig,
])

export type SizeItemConfig = z.infer<typeof sizeItemConfig>

export const minMaxConfig = z.array(
  z.object({
    type: z.enum(['min-width', 'min-height', 'max-width', 'max-height']),
    size: sizeItemConfig,
  }),
)

export const sizeConfig = z.object({
  width: sizeItemConfig,
  height: sizeItemConfig,
  minMax: minMaxConfig,
})

export function generateInitialSizeConfig(type: SizeItemConfig['type']) {
  return match(type)
    .returnType<SizeItemConfig>()
    .with('auto', () => ({ type: 'auto' }))
    .with('fill', () => ({ type: 'fill', value: 1 }))
    .with('relative', () => ({ type: 'relative', value: 100 }))
    .with('fixed', () => ({ type: 'fixed', value: 400 }))
    .with('viewport', () => ({ type: 'viewport', value: 100 }))
    .exhaustive()
}
