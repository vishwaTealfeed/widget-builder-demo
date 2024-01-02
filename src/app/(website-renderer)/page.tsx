import { z } from 'zod'
import { P, match } from 'ts-pattern'
import invariant from 'tiny-invariant'
import Script from 'next/script'
import { diff } from 'deep-object-diff'
import { elementData, elementType, responsiveLayoutConfig } from '@/lib/element'
import { ROOT_NODE, getParentNode } from '@/lib/tree'
import { computeFinalLayout, generateElementStyle } from '@/lib/layout/styles'
import SvgRenderer from '@/components/svg-renderer'
import { ICONS } from '@/lib/icons/icons'
import { gatherAllFonts, generateGoogleFontsUrl } from '@/lib/fonts'
import { css, globalStyles } from '@/lib/css'
import data from '../data/data.json'

export default function Page() {
  const { elementTree, responsiveElementsLayout, elementsType, elementsData } = z
    .object({
      elementTree: z.record(z.string(), z.array(z.string())),
      responsiveElementsLayout: z.record(z.string(), responsiveLayoutConfig),
      elementsType: z.record(z.string(), elementType),
      elementsData: z.record(z.string(), elementData),
    })
    .parse(data)

  const renderElement = (elementId: string) => {
    const parentNode = getParentNode(elementId, elementTree)

    const desktopLayout = computeFinalLayout(responsiveElementsLayout[elementId], 'desktop')
    const desktopParentLayout = parentNode
      ? computeFinalLayout(responsiveElementsLayout[parentNode], 'desktop')
      : undefined
    const desktopStyle = generateElementStyle(desktopLayout, desktopParentLayout)

    // TODO: Optimize the computation of the final layout
    const tabletLayout = computeFinalLayout(responsiveElementsLayout[elementId], 'tablet')
    const tabletParentLayout = parentNode
      ? computeFinalLayout(responsiveElementsLayout[parentNode], 'tablet')
      : undefined
    const tabletStyle = generateElementStyle(tabletLayout, tabletParentLayout)

    const mobileLayout = computeFinalLayout(responsiveElementsLayout[elementId], 'mobile')
    const mobileParentLayout = parentNode
      ? computeFinalLayout(responsiveElementsLayout[parentNode], 'mobile')
      : undefined
    const mobileStyle = generateElementStyle(mobileLayout, mobileParentLayout)

    const tabletStyleDiff = diff(mobileStyle, tabletStyle)
    const desktopStyleDiff = diff(mobileStyle, desktopStyle)

    const cssStyle = css({
      ...mobileStyle,
      tablet: tabletStyleDiff,
      desktop: desktopStyleDiff,
    })

    return match(elementsType[elementId])
      .returnType<React.ReactNode>()
      .with('container', () => {
        return (
          <div style={cssStyle} key={elementId} data-element-id={elementId}>
            {elementTree[elementId].map(renderElement)}
          </div>
        )
      })
      .with('text', () => {
        const elementData = elementsData[elementId]
        invariant(elementData.type === 'text', 'element should be text')
        return (
          <div
            style={cssStyle}
            key={elementId}
            dangerouslySetInnerHTML={{ __html: elementData.text }}
            data-element-id={elementId}
          />
        )
      })
      .with('image', () => {
        const elementData = elementsData[elementId]
        invariant(elementData.type === 'image', 'element should be image')
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={elementData.url} alt="" style={cssStyle} key={elementId} data-element-id={elementId} />
        )
      })
      .with('icon', () => {
        const elementData = elementsData[elementId]
        invariant(elementData.type === 'icon', 'element should be icon')
        return (
          <SvgRenderer svg={ICONS[elementData.icon].svg} style={cssStyle} key={elementId} data-element-id={elementId} />
        )
      })
      .with(P._, () => null)
      .exhaustive()
  }

  const googleFontsUrl = generateGoogleFontsUrl(gatherAllFonts(responsiveElementsLayout))

  return (
    <>
      <link href={googleFontsUrl} rel="stylesheet" data-source="render" />
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} data-source="render" />
      {renderElement(ROOT_NODE)}
      {process.env.NODE_ENV === 'development' ? (
        <Script
          id="debug"
          dangerouslySetInnerHTML={{
            __html: `
      function getElement(elementId) {
        const query = '[data-element-id="' + elementId + '"]'
        return document.querySelector(query)
      }
      window.getElement = getElement
      `,
          }}
        />
      ) : null}
    </>
  )
}
