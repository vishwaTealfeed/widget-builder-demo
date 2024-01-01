import z from 'zod'

export const flexLayoutConfig = z.object({
  type: z.literal('flex'),
  direction: z.enum(['row', 'column']),
  directionReverse: z.boolean().optional(),
  alignItems: z.enum(['flex-start', 'center', 'flex-end']),
  justifyContent: z.enum([
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'space-evenly',
    'stretch',
  ]),
  wrap: z.enum(['nowrap', 'wrap']),
  gap: z.number(),
})

export const gridLayoutConfig = z.object({
  type: z.literal('grid'),
  columns: z.number(),
  rows: z.number(),
  gap: z.number().nullable().optional(),
  alignItems: z.enum(['flex-start', 'center', 'flex-end']),
})

export const layoutConfig = z.discriminatedUnion('type', [flexLayoutConfig, gridLayoutConfig])
