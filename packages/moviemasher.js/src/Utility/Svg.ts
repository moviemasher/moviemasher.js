import { Dimensions } from "../Setup/Dimensions"
import { Transforms } from "../MoveMe"
import { NamespaceSvg } from "../Setup/Constants"

export const svgOfDimensions = (dimensions: Dimensions) => {
  const { width, height } = dimensions
  const svgElement = globalThis.document.createElementNS(NamespaceSvg, 'svg')
  svgElement.setAttribute('width', String(width))
  svgElement.setAttribute('height', String(height))
  svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`)
  return svgElement
}

export const svgTransformAttribute = (transforms: Transforms): string => {
  return transforms.reverse().map(transform => {
    const { transformType, x, y } = transform
    return `${transformType}(${x},${y})`
  }).join(' ')

}


export const svgBoundsElement = (size: Dimensions): SVGPolygonElement => {
  const { width, height } = size
  const rectElement = globalThis.document.createElementNS(NamespaceSvg, 'polygon')
  rectElement.setAttribute('points', `0,0 ${width},0 ${width},${height}, 0,${height}, 0,0`)
  rectElement.setAttribute('fill', 'none')
  rectElement.classList.add('bounds')
  return rectElement
}
