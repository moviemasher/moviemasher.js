import { assertDefined, errorThrow } from "@moviemasher/lib-core"
import React from "react"
import { useRef } from "../../Framework/FrameworkFunctions"
export const isSvg = (value: any): value is SVGSVGElement => {
	return value instanceof SVGSVGElement
}

export function assertSvg(value: any): asserts value is SVGSVGElement {
	if (!isSvg(value)) errorThrow(value, 'SVGSVGElement')
}

function mmIcon() {
	const raw = "﻿<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">\n  <defs>\n    <clipPath id=\"tube-m-m\">\n      <path d=\"\n        M 3.60 21.00 C 1.61 21.00 0.00 19.39 0.00 17.40 L 0.00 6.60 C 0.00 4.61 1.61 3.00 3.60 3.00 L 20.40 3.00 C 22.39 3.00 24.00 4.61 24.00 6.60 L 24.00 17.40 C 24.00 19.39 22.39 21.00 20.40 21.00 Z M 3.60 21.00\n        M 5.57 11.81 L 3.03 14.30 L 1.75 13.04 L 1.75 17.03 L 5.79 17.03 L 4.47 15.75 C 4.49 15.75 4.51 15.74 4.53 15.72 L 4.53 15.72 L 6.30 13.97 L 9.06 16.71 C 9.26 16.91 9.49 17.00 9.76 17.00 L 9.76 17.00 C 10.04 17.02 10.28 16.94 10.50 16.74 L 10.50 16.74 L 13.23 13.97 L 16.01 16.79 C 16.21 16.96 16.45 17.06 16.72 17.06 L 16.72 17.06 L 18.77 17.08 C 19.06 17.07 19.30 16.96 19.51 16.79 L 19.51 16.79 C 19.70 16.59 19.81 16.35 19.81 16.04 L 19.81 16.04 C 19.81 15.75 19.70 15.51 19.51 15.31 L 19.51 15.31 C 19.32 15.14 19.09 15.05 18.80 15.05 L 18.80 15.05 L 17.16 15.02 L 13.97 11.83 C 13.77 11.65 13.53 11.56 13.26 11.56 L 13.26 11.56 C 12.99 11.55 12.74 11.64 12.53 11.83 L 12.53 11.83 L 9.76 14.54 L 6.99 11.81 C 6.78 11.61 6.56 11.51 6.30 11.51 L 6.30 11.51 C 6.03 11.51 5.79 11.61 5.57 11.81\n        M 6.29 6.93 C 6.02 6.93 5.78 7.02 5.58 7.22 L 5.58 7.22 L 2.34 10.43 C 2.14 10.65 2.02 10.89 2.01 11.18 L 2.01 11.18 C 2.01 11.45 2.11 11.68 2.31 11.88 L 2.31 11.88 C 2.53 12.08 2.77 12.16 3.04 12.14 L 3.04 12.14 C 3.32 12.16 3.56 12.07 3.75 11.85 L 3.75 11.85 L 6.29 9.41 L 8.53 11.64 C 8.85 11.94 9.02 12.10 9.05 12.12 L 9.05 12.12 C 9.25 12.32 9.48 12.41 9.75 12.41 L 9.75 12.41 C 10.02 12.43 10.27 12.34 10.49 12.14 L 10.49 12.14 C 10.51 12.13 10.68 11.96 10.98 11.64 L 10.98 11.64 C 11.31 11.32 11.70 10.95 12.12 10.54 L 12.12 10.54 C 12.56 10.09 12.94 9.72 13.25 9.41 L 13.25 9.41 L 17.28 13.46 C 17.48 13.65 17.71 13.76 17.97 13.78 L 17.97 13.78 L 20.72 13.78 L 20.69 15.60 L 23.55 12.79 L 20.72 9.92 L 20.72 11.77 L 18.42 11.74 L 13.96 7.24 C 13.75 7.07 13.52 6.97 13.25 6.97 L 13.25 6.97 C 12.98 6.96 12.73 7.05 12.51 7.24 L 12.51 7.24 L 9.78 9.97 L 7.52 7.75 C 7.19 7.41 7.02 7.24 7.00 7.22 L 7.00 7.22 C 6.80 7.02 6.58 6.93 6.35 6.93 L 6.35 6.93 C 6.33 6.93 6.31 6.93 6.29 6.93\n      \" />\n    </clipPath>\n  </defs>\n  <path clip-path=\"url(#tube-m-m)\" d=\"M 0.00 0.00 L 24.00 0.00 L 24.00 24.00 L 0.00 24.00 Z M 0.00 0.00\" stroke=\"none\" fill=\"currentColor\" />\n</svg>\n"
	const remove = "﻿<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
	const removed = raw.replace(remove, '')
	const element = new DOMParser().parseFromString(removed, 'image/svg+xml')
	const child = element.firstChild
	assertSvg(child)
	return child
}

const MMIcon = mmIcon() //as SVGSVGElement
type MMIcon = typeof MMIcon
export { MMIcon }


export default function Test() {
	const ref = useRef<SVGSVGElement>(MMIcon)

  // React.useEffect(() => {
	// 	const icon = mmIcon()
	// 	assertDefined(icon)
  //   ref.current!.appendChild(icon)
  // }, [])

	return <svg ref={ref} />
}