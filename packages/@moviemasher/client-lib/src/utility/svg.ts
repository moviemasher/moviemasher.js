import type { NumberRecord, Rect, RectOptions, Size, SvgItems, Transparency } from '@moviemasher/shared-lib/types.js'

import { ALPHA, HEIGHT, MOVIEMASHER, NONE, SHORTEST, WIDTH, svgStringClean } from '@moviemasher/shared-lib/runtime.js'
import { assertDefined, assertPopulatedString, assertTrue } from '@moviemasher/shared-lib/utility/guards.js'
import { assertSizeAboveZero } from '@moviemasher/shared-lib/utility/rect.js'
import { svgDefsElement, svgImageElement, svgMaskElement, svgPolygonElement, svgSet, svgSetDimensions, svgSvgElement } from '@moviemasher/shared-lib/utility/svg.js'
import { MIME_SVG } from '../runtime.js'

let PatchSvgElement: SVGSVGElement
let SupportsSvgLoad = false

export const PatchSvgInitialize = (): SVGSVGElement => {
  const { document } = globalThis
  assertDefined(document)
  
  const element = svgSvgElement()
  element.setAttribute('style', 'display:none')

  const elements = document.getElementsByTagName('body')
  const body = elements.item(0)
  assertTrue(!!body, 'body')

  if (body) body.appendChild(element)
  return element
}

export const svgPatch = (value?: SVGSVGElement): SVGSVGElement => {
  // console.trace('svgPatch', value)
  if (value) return PatchSvgElement = value
  
  return PatchSvgElement ||= PatchSvgInitialize()
}

// export const svgSetTransformPoint = (element: SvgItem, point: Point | any) => {
//   assertPoint(point)

//   const { x, y } = point
//   if (!(x || y)) return 

//   svgSetTransform(element, `translate(${x}, ${y})`)
// }

// export const svgUseElement = (href?: string, className?: string, id?: string) => {
//   const { document } = MOVIEMASHER
//   const element = document.createElementNS(NAMESPACE_SVG, 'use')
  
//   if (isPopulatedString(href)) svgSet(element, svgId(href), 'href')
//   svgSet(element, id)
//   return svgAddClass(element, className)
// }

// export const svgFunc = (type: string, values: string) => {
//   const { document } = MOVIEMASHER
//   const element = document.createElementNS(NAMESPACE_SVG, type)
//   svgSet(element, values, 'tableValues')
//   svgSet(element, 'discrete', 'type')
//   return element
// }

export const svgImagePromise = (url: string, dontPatch?: boolean): Promise<SVGImageElement> => {
  const patch = !(dontPatch || SupportsSvgLoad) 
  return new Promise<SVGImageElement>((resolve, reject) => {
    const element = svgImageElement()
    const completed = () => {
      element.removeEventListener('error', failed)
      element.removeEventListener('load', passed)
      if (patch) svgPatch().removeChild(element) 
    }
    const failed = (error: any) => {
      completed()
      reject(error)
    }
    const passed = () => {
      completed()
      resolve(element)
    }
    element.addEventListener('error', failed, { once: true })
    element.addEventListener('load', passed, { once: true })
    if (patch) svgPatch().appendChild(element)
    
    svgSet(element, url, 'href')
  })
}

export const svgImagePromiseWithOptions = (url:string, options: RectOptions): Promise<SVGImageElement> => {
  return svgImagePromise(url).then(element => {
    const { shortest, lock = NONE, ...rect } = options
    assertSizeAboveZero(rect)
    const svgRect: NumberRecord = { ...rect }

    switch (lock) {
      case HEIGHT: {
        svgRect.height = -1 
        break
      }
      case WIDTH: {
        svgRect.width = -1
        break
      }
      case NONE: {
        svgSet(element, NONE, 'preserveAspectRatio')
        break
      }
      default: {
        assertPopulatedString(shortest, SHORTEST)
        svgRect[shortest] = -1
        break
      }
    }
    // console.debug('svgImagePromiseWithOptions', { url, options, svgRect })
    svgSetDimensions(element, svgRect)
    return element
  })
}

export const svgColorMask = (svgImage: Element, size: Size, transparency: Transparency = ALPHA, className = '', rect?: Rect): SVGSVGElement => {
  const defs: SvgItems = []
  // const id = idGenerateString()
  // const gradientElement = svgGradientElement(id)
  // const color = svgUrl(id)
  // defs.push(gradientElement)
  const maskedElement =  svgPolygonElement(rect || size, className)
  const maskElement = svgMaskElement(maskedElement, transparency)   
  maskElement.appendChild(svgImage)

  defs.push(maskElement)
  return svgSvgElement(size, [svgDefsElement(defs), maskedElement])
}

export const svgStringElement = (svgString: string) => {
  const cleaned = svgStringClean(svgString)
  if (!cleaned) return

  const parser = new globalThis.window.DOMParser()
  const parsed = parser.parseFromString(cleaned, MIME_SVG)
  const firstChild = parsed.children[0]
  if (!firstChild) return

  return firstChild
}

// test for support for load events from svg images
(() => {
  const { document } = MOVIEMASHER
  if (document) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    const context = canvas.getContext('2d')
    if (context) {
      context.fillRect(0, 0, 1, 1)
      svgImagePromise(canvas.toDataURL(), true).then(() => {
        SupportsSvgLoad = true
      })
    }
  }
})()


// export const svgFeImageElement = (id?: string, result?: string): SVGFEImageElement => {
//   const { document } = MOVIEMASHER
//   const element = document.createElementNS(NAMESPACE_SVG, 'feImage') 
//   if (isPopulatedString(id)) svgSet(element, svgId(id), 'href')
//   svgSet(element, result, 'result')
//   return element
// }

// export const svgGradientStopElement = (offset: string, color: string): SVGStopElement => {
//   const { document } = MOVIEMASHER
//   const element = document.createElementNS(NAMESPACE_SVG, 'stop')
//   svgSet(element, offset, 'offset')
//   svgSet(element, color, 'stop-color')
//   return element
// }

// export const svgGradientElement = (id: string): SVGLinearGradientElement => {
//   const { document } = MOVIEMASHER
//   const element = document.createElementNS(NAMESPACE_SVG, 'linearGradient')
//   svgSet(element, id)
//   svgAppend(element, [
//     svgGradientStopElement('0%', 'red'),
//     svgGradientStopElement('5%', 'red'),
//     svgGradientStopElement('10%', 'white'),
//     svgGradientStopElement('90%', 'white'),
//     svgGradientStopElement('95%', 'red'),
//   ])
//   return element
// }

