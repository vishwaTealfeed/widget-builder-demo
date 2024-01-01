import { z } from 'zod'

export const positionConfig = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('relative'),
  }),
  z.object({
    type: z.enum(['absolute', 'fixed', 'sticky']),
    top: z.number().nullable().optional(),
    left: z.number().nullable().optional(),
    bottom: z.number().nullable().optional(),
    right: z.number().nullable().optional(),
  }),
])
