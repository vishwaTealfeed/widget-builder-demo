import React, { cloneElement, createElement } from 'react'

type NodeData = {
  type: string
  props: Record<string, any>
  children: NodeData[]
}

type SVGRendererProps = React.ComponentProps<'svg'> & {
  svg: NodeData
}

function renderNode(data: NodeData, index: number): React.ReactElement {
  return createElement(data.type, { ...data.props, key: `${data.type}-${index}` }, data.children.map(renderNode))
}

export default function SVGRenderer({ svg, ...rest }: SVGRendererProps) {
  if (svg.type !== 'svg') {
    throw new Error('Invalid SVG')
  }

  return cloneElement(renderNode(svg, 0), rest)
}
