import { errorThrow } from '@moviemasher/lib-core'

export const isSvg = (value: any): value is SVGSVGElement => {
	return value instanceof SVGSVGElement
}

export function assertSvg(value: any): asserts value is SVGSVGElement {
	if (!isSvg(value)) errorThrow(value, 'SVGSVGElement')
}

let _svgDomparser: DOMParser | undefined
function svgDomparser(): DOMParser {
  if (!_svgDomparser) _svgDomparser = new DOMParser()
  return _svgDomparser
}


export const svgFromString = (svgString: string): SVGSVGElement => {
	const element = svgDomparser().parseFromString(svgString, 'image/svg+xml')
	const { firstChild } = element
	assertSvg(firstChild)
	return firstChild
}
