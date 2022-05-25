import {
  Context2D,
  VisibleContextData,
  VisibleContextElement,
  VisibleSource,
  Point,
  Rect,
  Size,
  TextStyle,
  CanvasVisibleSource,
} from "../declarations"
import { Errors } from "../Setup/Errors"
import { Is } from "../Utility/Is"

const $canvas = 'canvas'
const $2d = '2d'
const Point0 = { x: 0, y: 0 }

export interface VisibleContextArgs {
  label?: string
  context2d?: Context2D
  size?: Size
}

const VisibleContextInstances: VisibleContext[]  = []

export class VisibleContext {
  constructor(object: VisibleContextArgs = {}) {
    const { size, context2d, label = String(VisibleContextInstances.length + 1) } = object
    this.label = `VisibleContext[${label}]`
    // console.trace("VisibleContext", "constructor", context2d)
    if (context2d) this._context2d = context2d
    VisibleContextInstances.push(this)
    if (size) this.size = size
  }

  _alpha = 1.0
  get alpha(): number {
    // return this._alpha
    return this.context2d.globalAlpha
  }
  set alpha(value: number) {
    this._alpha = value
    // this.canvas.style.opacity = String(this._alpha)
    this.context2d.globalAlpha = value
  }

  get canvas() : HTMLCanvasElement { return this.context2d.canvas }

  set canvas(value: HTMLCanvasElement) {
    const context2d = value.getContext("2d")
    if (!context2d) throw Errors.invalid.canvas
    this.context2d = context2d
  }

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

  _composite: string = 'normal'
  get composite(): string {
    // return this._composite
    return this.context2d.globalCompositeOperation
  }

  set composite(value: string) {
    this.canvas.style.mixBlendMode = value
    this.canvas.classList.add('composite')
    this._composite = value
    this.context2d.globalCompositeOperation = value as typeof this.context2d.globalCompositeOperation
  }

  private _context2d?: Context2D
  private get context2d() : Context2D {
    if (!this._context2d) {
      // console.trace(this.constructor.name, "get context2d creating canvas")
      const canvas = globalThis.document.createElement($canvas)
      const context = canvas.getContext($2d)
      if (!context) throw Errors.internal + 'context'

      this._context2d = context
    }
    return this._context2d
  }

  private set context2d(value : Context2D) {
    // console.log(this.constructor.name, "set context2d", value)
    this._context2d = value
  }

  get dataUrl() : string { return this.canvas.toDataURL() }

  draw(source: CanvasVisibleSource) : VisibleContext {
    return this.drawAtPoint(source, Point0)
  }

  drawAtPoint(source: CanvasVisibleSource, point: Point) : VisibleContext {
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

  drawInRect(source: CanvasVisibleSource, rect: Rect) : VisibleContext {
    const { x, y, width, height } = rect
    this.context2d.drawImage(source, x, y, width, height)
    return this
  }

  drawInRectFromRect(source: CanvasVisibleSource, inRect: Rect, fromRect: Rect) : VisibleContext {
    const { x: xIn, y: yIn, width: wIn, height: hIn } = inRect
    const { x, y, width: w, height: h } = fromRect
    const { width: sourceWidth, height: sourceHeight } = source
    if (xIn + wIn > sourceWidth || yIn + hIn > sourceHeight) throw Errors.eval.sourceRect + JSON.stringify(inRect) + ' ' + sourceWidth + 'x' + sourceHeight

    this.context2d.drawImage(source, xIn, yIn, wIn, hIn, x, y, w, h)
    return this
  }

  drawInRectFromSize(source: CanvasVisibleSource, rect: Rect, size: Size) : VisibleContext {
    return this.drawInRectFromRect(source, rect, { ...Point0, ...size })
  }

  drawInSizeFromSize(source: CanvasVisibleSource, inSize : Size, fromSize : Size) : VisibleContext {
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

  drawToSize(source: CanvasVisibleSource, size: Size) : VisibleContext {
    return this.drawInRect(source, { ...Point0, ...size })
  }

  drawWithAlpha(source: CanvasVisibleSource, alpha: number) : VisibleContext {
    const original = this.alpha
    this.alpha = alpha
    const result = this.draw(source)
    this.alpha = original
    return result
  }

  drawWithComposite(source: CanvasVisibleSource, composite: string): VisibleContext {
    // console.log(this.constructor.name, "drawWithComposite", composite)
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

  get imageData() : VisibleContextData { return this.imageDataFromSize(this.size) }

  get imageDataFresh() : VisibleContextData {
    const { width, height } = this.size
    return this.context2d.createImageData(width, height)
  }

  imageDataFromRect(rect : Rect) : VisibleContextData {
    const { x, y, width, height } = rect
    return this.context2d.getImageData(x, y, width, height)
  }

  imageDataFromSize(size : Size) : VisibleContextData {
    return this.imageDataFromRect({ ...Point0, ...size })
  }

  label: string

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

  toString(): string { return this.label }

  get visibleSource(): VisibleSource { return this.canvas }

  static get instances(): VisibleContext[] { return VisibleContextInstances }
  static reset() {
    VisibleContextInstances.length = 0
  }

  static debugInstances(contexts: VisibleContext[] = []): void {
    const lines1 = VisibleContext.instances.map(context => {
      const supplied = contexts.includes(context) ? '√' : '?'
      const { label } = context
      return [supplied, label, context.canvas.style.mixBlendMode].join(" ")
    })
    console.log("DEBUG VisibleContext instances", VisibleContext.instances.length, "\n", lines1.join("\n"))

    const notFound: VisibleContext[] = contexts.filter(context => !VisibleContext.instances.includes(context))
    if (!notFound.length) return

    const lines2 = notFound.map((context, index) => {
      const supplied = contexts.includes(context) ? ' ' : '?'
      const { label } = context
      return [supplied, label, context.canvas.style.mixBlendMode].join(" ")
    })
    console.log("VisibleContext NOTFOUND", notFound.length, "supplied", contexts.length, "\n", lines2.join("\n"))

  }
}
