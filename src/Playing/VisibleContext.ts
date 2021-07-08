import {
  Context2D,
  ContextData,
  ContextElement,
  DrawingSource,
  Point,
  Rect,
  Size,
  TextStyle
} from "../Setup/declarations"
import { Errors } from "../Setup/Errors"
import { Is } from "../Utilities/Is"


const blah = ""

const $canvas = 'canvas'
const $2d = '2d'
const Point0 = { x: 0, y: 0 }

export class VisibleContext {
  constructor(object : { context2d? : Context2D } = {}) {
    // console.trace("VisibleContext", "constructor")
    if (object.context2d) this.__context2d = object.context2d
  }

  get alpha() : number { return this.context2d.globalAlpha }

  set alpha(value : number) { this.context2d.globalAlpha = value }

  get canvas() : ContextElement { return this.context2d.canvas }

  clear() : VisibleContext {
    return this.clearSize(this.size)
  }

  clearSize(size : Size) : VisibleContext {
    return this.clearRect({ ...Point0, ...size })
  }

  clearRect(rect : Rect) : VisibleContext {
    const { x, y, width, height } = rect
    this.context2d.clearRect(x, y, width, height)
    return this
  }

  get composite() : string { return this.context2d.globalCompositeOperation }

  set composite(value : string) { this.context2d.globalCompositeOperation = value }

  get context2d() : Context2D {
    if (!this.__context2d) {
      // console.trace(this.constructor.name, "get context2d creating canvas")
      const canvas = globalThis.document.createElement($canvas)
      const context = canvas.getContext($2d)
      if (!context) throw Errors.internal

      this.__context2d = context
    }
    return this.__context2d
  }

  set context2d(value : Context2D) {
    // console.log(this.constructor.name, "set context2d", value)
    this.__context2d = value
  }

  get dataUrl() : string { return this.canvas.toDataURL() }

  draw(source : DrawingSource) : VisibleContext {
    return this.drawAtPoint(source, Point0)
  }

  drawAtPoint(source : DrawingSource, point: Point) : VisibleContext {
    const { x, y } = point
    this.context2d.drawImage(source, x, y)
    return this
  }

  drawFill(fill : string) : VisibleContext {
    return this.drawFillToSize(fill, this.size)
  }

  drawFillInRect(fill : string, rect : Rect) : VisibleContext {
    const { x, y, width, height } = rect
    const fillOriginal = this.fill
    this.fill = fill
    this.context2d.fillRect(x, y, width, height)
    this.fill = fillOriginal
    return this
  }

  drawFillToSize(fill : string, size : Size) : VisibleContext {
    return this.drawFillInRect(fill, { ...Point0, ...size })
  }

  drawImageData(data : ImageData) : VisibleContext {
    return this.drawImageDataAtPoint(data, Point0)
  }

  drawImageDataAtPoint(data : ImageData, point : Point) : VisibleContext {
    const { x, y } = point
    this.context2d.putImageData(data, x, y)
    return this
  }

  drawInRect(source : DrawingSource, rect: Rect) : VisibleContext {
    const { x, y, width, height } = rect
    this.context2d.drawImage(source, x, y, width, height)
    return this
  }

  drawInRectFromRect(source : DrawingSource, inRect: Rect, fromRect: Rect) : VisibleContext {
    const { x: xIn, y: yIn, width: wIn, height: hIn } = inRect
    const { x, y, width: w, height: h } = fromRect
    const { width: sourceWidth, height: sourceHeight } = source
    if (xIn + wIn > sourceWidth || yIn + hIn > sourceHeight) throw Errors.eval.sourceRect + JSON.stringify(inRect) + ' ' + sourceWidth + 'x' + sourceHeight

    this.context2d.drawImage(source, xIn, yIn, wIn, hIn, x, y, w, h)
    return this
  }

  drawInRectFromSize(source : DrawingSource, rect: Rect, size: Size) : VisibleContext {
    return this.drawInRectFromRect(source, rect, { ...Point0, ...size })
  }

  drawInSizeFromSize(source : DrawingSource, inSize : Size, fromSize : Size) : VisibleContext {
    const inRect = { ...Point0, ...inSize }
    const fromRect = { ...Point0, ...fromSize }
    return this.drawInRectFromRect(source, inRect, fromRect)
  }

  drawText(text: string, style : TextStyle) : VisibleContext {
    return this.drawTextAtPoint(text, style, Point0)
  }

  drawTextAtPoint(text: string, style : TextStyle, point : Point) : VisibleContext {
    const { x, y } = point
    const { height, family, color, shadow, shadowPoint } = style

    const fillOriginal = this.fill
    const fontOriginal = this.font
    const shadowOriginal = this.shadow
    const shadowPointOriginal = this.shadowPoint

    if (shadow) {
      this.shadow = shadow
      if (shadowPoint) this.shadowPoint = shadowPoint
    }

    this.font = `${height}px "${family}"`
    this.fill = color
    this.context2d.fillText(text, x, y + height)

    this.font = fontOriginal
    this.fill = fillOriginal
    if (shadow) {
      this.shadow = shadowOriginal
      if (shadowPoint) this.shadowPoint = shadowPointOriginal
    }
    return this
  }

  drawToSize(source : DrawingSource, size: Size) : VisibleContext {
    return this.drawInRect(source, { ...Point0, ...size })
  }

  drawWithAlpha(source : DrawingSource, alpha: number) : VisibleContext {
    const original = this.alpha
    this.alpha = alpha
    const result = this.draw(source)
    this.alpha = original
    return result
  }

  drawWithComposite(source : DrawingSource, composite: string) : VisibleContext {
    const original = this.composite
    this.composite = composite
    const result = this.draw(source)
    this.composite = original
    return result
  }

  get fill() : string { return String(this.context2d.fillStyle) }

  set fill(value : string) { this.context2d.fillStyle = value }

  get font() : string { return this.context2d.font }

  set font(value : string) { this.context2d.font = value }

  get imageData() : ContextData { return this.imageDataFromSize(this.size) }

  get imageDataFresh() : ContextData {
    const { width, height } = this.size
    return this.context2d.createImageData(width, height)
  }

  imageDataFromRect(rect : Rect) : ContextData {
    const { x, y, width, height } = rect
    return this.context2d.getImageData(x, y, width, height)
  }

  imageDataFromSize(size : Size) : ContextData {
    return this.imageDataFromRect({ ...Point0, ...size })
  }

  get drawingSource() : DrawingSource { return this.canvas }

  get shadow() : string { return this.context2d.shadowColor }

  set shadow(value : string) { this.context2d.shadowColor = value }

  get shadowPoint() : Point {
    return { x: this.context2d.shadowOffsetX, y: this.context2d.shadowOffsetY }
  }

  set shadowPoint(point : Point) {
    this.context2d.shadowOffsetX = point.x
    this.context2d.shadowOffsetY = point.y
  }

  get size() : Size { return { width: this.canvas.width, height: this.canvas.height } }

  set size(value : Size) {
    const { width, height } = value
    if (Is.aboveZero(width)) this.canvas.width = width
    if (Is.aboveZero(height)) this.canvas.height = height
  }

  private __context2d? : Context2D
}
