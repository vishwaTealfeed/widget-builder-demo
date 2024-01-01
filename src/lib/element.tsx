import { HexagonIcon, ImageIcon, TypeIcon } from 'lucide-react'
import z from 'zod'
import { containerStyleConfig, generateInitialContainerStyleConfig } from './layout/container-config'
import { generateInitialTextData, generateInitialTextStyleConfig, textStyleConfig } from './layout/text-config'
import { generateInitialImageData, generateInitialImageStyleConfig, imageStyleConfig } from './layout/image-config'
import { layoutConfig } from './layout/layout-config'
import { generateInitialIconData, generateInitialIconStyleConfig, iconStyleConfig } from './layout/icon-config'
import { ICONS, IconName } from './icons/icons'

export const elementType = z.enum(['image', 'text', 'container', 'icon'])
export type ElementType = z.infer<typeof elementType>

export const elementLayoutConfig = z.discriminatedUnion('type', [
  containerStyleConfig,
  textStyleConfig,
  imageStyleConfig,
  iconStyleConfig,
])
export type ElementLayoutConfig = z.infer<typeof elementLayoutConfig>

// const partialLayoutConfig = z.union([
//   containerStyleConfig.partial(),
//   textStyleConfig.partial(),
//   imageStyleConfig.partial(),
//   iconStyleConfig.partial(),
// ])
// TODO: Figure out the deep partial config
const partialLayoutConfig = z.any()

export const responsiveLayoutConfig = z.object({
  desktop: elementLayoutConfig,
  tablet: partialLayoutConfig.optional(),
  mobile: partialLayoutConfig.optional(),
})

export type ResponsiveLayoutConfig = z.infer<typeof responsiveLayoutConfig>

type ElementConfig = {
  type: ElementType
  icon: React.ReactElement
  name: string
  styleConfig: z.ZodType<ElementLayoutConfig>
  generateInitialStyleConfig: (config: Partial<any>) => ElementLayoutConfig
  generateInitialData?: () => ElementData
  disabled: boolean
}

export const ELEMENT_ITEMS: ElementType[] = ['container', 'text', 'image', 'icon']

export const ELEMENT_CONFIG: Record<ElementType, ElementConfig> = {
  container: {
    type: 'container',
    name: 'Container',
    icon: <div className="h-3 w-3 rounded border border-dashed border-current" />,
    disabled: false,
    styleConfig: containerStyleConfig,
    generateInitialStyleConfig: generateInitialContainerStyleConfig,
  },
  text: {
    type: 'text',
    name: 'Text',
    icon: <TypeIcon className="h-3 w-3" />,
    disabled: false,
    styleConfig: textStyleConfig,
    generateInitialStyleConfig: generateInitialTextStyleConfig,
    generateInitialData: generateInitialTextData,
  },
  image: {
    type: 'image',
    name: 'Image',
    icon: <ImageIcon className="h-3 w-3" />,
    disabled: false,
    styleConfig: imageStyleConfig,
    generateInitialStyleConfig: generateInitialImageStyleConfig,
    generateInitialData: generateInitialImageData,
  },
  icon: {
    type: 'icon',
    name: 'Icon',
    icon: <HexagonIcon className="h-3 w-3" />,
    disabled: false,
    styleConfig: iconStyleConfig,
    generateInitialStyleConfig: generateInitialIconStyleConfig,
    generateInitialData: generateInitialIconData,
  },
}

export const elementPreviewSchema = z.object({ type: z.literal('element-preview'), elementType })
export const elementDataSchema = z.object({
  type: z.literal('container-droppable'),
  elementId: z.string(),
  elementIndex: z.number(),
  stackIndex: z.number(),
  layout: layoutConfig,
})

export const textElementData = z.object({
  type: z.literal('text'),
  text: z.string(),
})
export type TextElementData = z.infer<typeof textElementData>

export const imageElementData = z.object({
  type: z.literal('image'),
  url: z.string().url(),
})
export type ImageElementData = z.infer<typeof imageElementData>

export const iconElementData = z.object({
  type: z.literal('icon'),
  icon: z.enum(Object.keys(ICONS) as [IconName, ...IconName[]]),
})
export type IconElementData = z.infer<typeof iconElementData>

export const elementData = z.discriminatedUnion('type', [textElementData, imageElementData, iconElementData])
export type ElementData = z.infer<typeof elementData>
