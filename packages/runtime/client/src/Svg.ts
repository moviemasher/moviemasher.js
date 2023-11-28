import type { ClientImage, ClientVideo } from "./ClientMedia.js"

export type FfmpegSvgFilter = SVGFEFloodElement | SVGFEOffsetElement | SVGFEBlendElement | SVGClipPathElement
export type SvgFilter = FfmpegSvgFilter | SVGFEColorMatrixElement | SVGFEConvolveMatrixElement | SVGFEDisplacementMapElement | SVGFEComponentTransferElement
export interface SvgFilters extends Array<SvgFilter>{}
export type SvgItem = SVGElement | ClientImage | ClientVideo
export interface SvgItems extends Array<SvgItem>{}
export type SvgItemsTuple = [SvgItems, SvgItems]
export type PreviewElement = SVGSVGElement | HTMLDivElement
export interface PreviewElements extends Array<PreviewElement>{}
export type SvgOrImage = SVGSVGElement | ClientImage
