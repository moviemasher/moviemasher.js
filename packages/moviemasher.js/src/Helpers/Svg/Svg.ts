import { LoadedImageOrVideo, LoadedImage } from "../../Load/Loaded";



export type FfmpegSvgFilter = SVGFEFloodElement | SVGFEOffsetElement | SVGFEBlendElement | SVGClipPathElement;
export type SvgFilter = FfmpegSvgFilter | SVGFEColorMatrixElement | SVGFEConvolveMatrixElement | SVGFEDisplacementMapElement | SVGFEComponentTransferElement;
export type SvgFilters = SvgFilter[];
export type SvgItem = SVGElement | LoadedImageOrVideo;
export type SvgItems = SvgItem[];
export type SvgItemsTuple = [SvgItems, SvgItems];
export type PreviewItem = SVGSVGElement | HTMLDivElement;
export type PreviewItems = PreviewItem[];
export type SvgOrImage = SVGSVGElement | LoadedImage;
