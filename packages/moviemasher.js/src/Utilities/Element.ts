import { ScrollMetrics } from '../declarations'


const ElementScrollProps = [
  'scrollPaddingleft',
  'scrollPaddingRight',
  'scrollPaddingTop',
  'scrollPaddingBottom',
]
const elementScrollMetrics = (element?: Element | null): ScrollMetrics | undefined => {
  if (!element) return

  const style: CSSStyleDeclaration = getComputedStyle(element)
  const entries = ElementScrollProps.map(key => {
    const value = style.getPropertyValue(key) || '0px'
    const number = Number(value.slice(0, -2))
    return [key, isNaN(number) ? 0 : number]
  })
  const { scrollLeft, scrollTop } = element
  const { x, y, width, height } = element.getBoundingClientRect()
  entries.push(['scrollLeft', scrollLeft])
  entries.push(['scrollTop', scrollTop])
  entries.push(['x', x])
  entries.push(['y', y])
  entries.push(['width', width])
  entries.push(['height', height])
  return Object.fromEntries(entries)
}

/**
 * @category Utility
 */
const Element = {
  scrollMetrics: elementScrollMetrics,
}

export { Element, elementScrollMetrics }
