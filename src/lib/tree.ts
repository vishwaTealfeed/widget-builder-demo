import { NodeModel } from '@minoru/react-dnd-treeview'
import { ELEMENT_CONFIG, ElementType } from './element'

export const ROOT_NODE = 'ROOT'

export const ROOT_NODE_LAYOUT = ELEMENT_CONFIG.container.generateInitialStyleConfig({
  size: {
    height: {
      type: 'relative',
      value: 100,
    },
  },
  style: {
    background: {
      type: 'color',
      color: '#ffffff',
      opacity: 100,
    },
  },
})

export function gatherAllChildren(
  elementId: string,
  elementTree: Record<string, string[]>,
  elementsType: Record<string, ElementType>,
): string[] {
  if (elementsType[elementId] !== 'container') {
    return []
  }
  const children = [
    ...elementTree[elementId],
    ...elementTree[elementId].flatMap((childId) => gatherAllChildren(childId, elementTree, elementsType)),
  ]
  return children
}

export function getParentNode(elementId: string, elementTree: Record<string, string[]>, rootId: string = ROOT_NODE) {
  if (elementId === rootId) {
    return undefined
  }
  const nodesToCheck = [rootId]
  while (nodesToCheck.length) {
    const node = nodesToCheck.shift()!
    const children = elementTree[node] ?? []
    if (children.includes(elementId)) {
      return node
    }
    nodesToCheck.push(...children)
  }
  return undefined
}

export function gatherAllParent(elementId: string, elementTree: Record<string, string[]>) {
  const parents: string[] = []
  let parent = getParentNode(elementId, elementTree)
  while (parent) {
    parents.push(parent)
    parent = getParentNode(parent, elementTree)
  }
  return parents
}

export function buildElementTree(
  tree: NodeModel<{ elementType: ElementType }>[],
  rootId: string = ROOT_NODE,
): Record<string, string[]> {
  const elementTree: Record<string, string[]> = {
    [rootId]: [],
  }
  for (const node of tree) {
    if (node.parent) {
      if (node.data?.elementType === 'container') {
        elementTree[node.id] = elementTree[node.id] ?? []
      }
      elementTree[node.parent] = elementTree[node.parent] ?? []
      elementTree[node.parent].push(node.id as string)
    }
  }
  return elementTree
}
