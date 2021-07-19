import { NumberObject } from '../declarations'

const ElementScrollProps = [
  'height',
  'width',
  'scrollPaddingleft',
  'scrollPaddingRight',
  'scrollPaddingTop',
  'scrollPaddingBottom',
  'x',
  'y',
]
const elementScrollMetrics = (element?: Element | null): NumberObject | undefined => {
  if (!element) return


  const style: CSSStyleDeclaration = getComputedStyle(element)
  const entries = ElementScrollProps.map(key => {
    const value = style.getPropertyValue(key) || '0px'
    const number = Number(value.slice(0, -2))
    return [key, isNaN(number) ? 0 : number]
  })
  const { scrollLeft, scrollTop } = element
  entries.push(['scrollLeft', scrollLeft])
  entries.push(['scrollTop', scrollTop])
  return Object.fromEntries(entries)
}

const Element = {
  scrollMetrics: elementScrollMetrics,
}

export { Element, elementScrollMetrics }
