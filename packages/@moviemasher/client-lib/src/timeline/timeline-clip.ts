import type { ClientClip,BooleanRecord, DataOrError, ListenersFunction, Propertied, PropertyId, Size, SvgElement, TargetId, Timing } from '@moviemasher/shared-lib/types.js'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit'
import type { OptionalContent, TemplateContents } from '../client-types.js'
import type {  ClipLocation, DropTarget, EventClipElementDetail, Timeout } from '../types.js'

import { IntersectionController } from '@lit-labs/observers/intersection-controller.js'
import { ResizeController } from '@lit-labs/observers/resize-controller.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { $CLIP, $CONTAINER, $CONTENT, $FRAMES, $MASH, $NONE, DOT, MOVIE_MASHER, SIZE_ZERO, errorThrow, isDefiniteError, isTiming, jsonStringify } from '@moviemasher/shared-lib/runtime.js'
import { isDefined } from '@moviemasher/shared-lib/utility/guard.js'
import { assertDefined, assertPositive, isChangeEdit, isMashAsset, isTargetId } from '@moviemasher/shared-lib/utility/guards.js'
import { copySize, sizeNotZero } from '@moviemasher/shared-lib/utility/rect.js'
import { html } from 'lit-html'
import { Component, ComponentLoader } from '../base/component.js'
import { assertClientAudibleInstance, isClientAudibleInstance, isClientInstance } from '../guards/guards.js'
import { assertClientClip, isClientClip } from '../guards/ClientMashGuards.js'
import { DropTargetMixin, SIZE_REACTIVE_DECLARATIONS, SizeReactiveMixin } from '../mixin/component.js'
import { X_MOVIEMASHER, eventStop } from '../runtime.js'
import { dropped, droppedMashIndex } from '../utility/draganddrop.js'
import { EventChangeClipId, EventChangeScalar, EventClip, EventClipElement, EventEdited, EventRemoveClip, EventScalar, EventScrollRoot, EventTrackClipIcon, StringEvent } from '../utility/events.js'
import { pixelToFrame } from '@moviemasher/shared-lib/utility/pixel.js'

interface Trimming {
  clickedScroll: number
  clickedValue: number
  clickedX: number
  key: string
}

const TRIM_WIDTH = 2
const HOVERING = 'hovering'
const TRIMMING = 'trimming'

function assertTiming(value: any, name?: string): asserts value is Timing {
  if (!isTiming(value)) errorThrow(value, 'Timing', name)
}

export const TimelineClipTag = 'movie-masher-timeline-clip'

const WithDropTargetMixin = DropTargetMixin(ComponentLoader)
const WithSizeReactiveMixin = SizeReactiveMixin(WithDropTargetMixin)
/**
 * @category Elements
 */
export class TimelineClipElement extends WithSizeReactiveMixin implements DropTarget {
  constructor() {
    super()
    this.handlePointerMove = this.handlePointerMove.bind(this)
    this.handlePointerUp = this.handlePointerUp.bind(this)
    this.listeners[EventEdited.Type] = this.handleChanged.bind(this)
  }
  
  private _clip?: ClientClip
  private get clip(): ClientClip {
    if (this._clip) return this._clip

    const { clipId } = this
    const clipEvent = new EventClip(clipId)
    MOVIE_MASHER.dispatch(clipEvent)
    const { clip } = clipEvent.detail
    assertClientClip(clip)
    return this._clip = clip
  }

  clipId = ''

  private clipSize = { ...SIZE_ZERO } 

  override connectedCallback(): void {
    super.connectedCallback()
    const event = new EventScrollRoot()
    this.dispatchEvent(event)
    const { root } = event.detail
    if (root) {
      this.intersectionController = new IntersectionController<boolean>(
        this, { target: this, config: { root }, callback: this.handleIntersection.bind(this) }
      )
    }
    this.resizeController = new ResizeController<Size>(
      this, { target: this, callback: this.handleResize.bind(this) }
    )
  }

  protected override get defaultContent(): OptionalContent { 
    const contents: TemplateContents = []
    const { hideLabels } = this.options

    const { label } = this
    if (label && !hideLabels) contents.push(html`<label>${label}</label>`)
    contents.push(html`<div class='content'></div>`)
    const trimContent = this.trimContent()
    contents.push(html`<div class='background'></div>`)
    contents.push(html`<div class='drop-box'>${trimContent}</div>`)
    return html`${contents}`
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    delete this.intersectionController
    delete this.resizeController
  }

  private drawBackgroundAndUpdate() {
    const { clipId, scale, clipSize, gap } = this
    if (sizeNotZero(clipSize)) {
      const event = new EventTrackClipIcon(clipId, clipSize, scale, gap)
      MOVIE_MASHER.dispatch(event)
      const { promise, background } = event.detail
      if (promise && background) {
        this.hasChanged = false 
        this.sizeWhenUpdated = copySize(clipSize)
        
        this.element('div.background').replaceChildren(background)
        this.waitingPromise = promise
      }
    }
    this.timeoutStart()
  }

  protected override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties)
    
    // console.log(this.tagName, 'firstUpdated calling startTimeout', this.hasChanged)
    this.timeoutStart()
  }

  private gap = 2

  private handleChange = () => { 
    if (this.intersecting) this.drawBackgroundAndUpdate()
    else this.hasChanged = true 
  }

  private handleChanged(event: EventEdited): void {
    const { detail: action } = event
    if (!isChangeEdit(action)) return

    const { target, affects } = action
    if (isMashAsset(target)) {
      if (!affects.includes(`${$MASH}.color`)) return
    } else {
      const isClip = isClientClip(target)
      const isInstance = !isClip && isClientInstance(target)
      if (!(isClip || isInstance)) return

      const clip = isClip ? target : target.clip
      if (clip.id !== this.clipId) return
    }  
    this.handleChange()
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): boolean {
    const some = entries.some(entry => entry.isIntersecting)
    // console.log(this.tagName, 'handleIntersection', some)
    this.intersecting = some
    if (some && this.hasChanged) {
      // console.log(this.tagName, 'handleIntersection calling handleChange')
      this.handleChange()
    }
   
    return some
  }
  
  override handleDropped(event: DragEvent): void {
    const mashIndex = this.mashIndex(event)
    const { frame } = mashIndex!
    // let track handle if it's not dense
    if (isDefined(frame)) return 

    eventStop(event)
    dropped(event, mashIndex)
  }


  private handlePointerUp = (event: PointerEvent) => {
    eventStop(event)
    this.classList.toggle(TRIMMING, false)
    delete TimelineClipElement.trimming
    globalThis.window.removeEventListener('pointermove', this.handlePointerMove)
    globalThis.window.removeEventListener('pointerup', this.handlePointerUp)
  }


  private handlePointerMove(event: PointerEvent) {
    const { propertyId } = this
    const value = this.eventValue(event)
    // console.log(this.tagName, 'handlePointerMove', propertyId, value)

    MOVIE_MASHER.dispatch(new EventChangeScalar(propertyId, value))
  }


  private eventValue(event: PointerEvent): number {
    const { clientX: currentX } = event
    const { scrollCurrent: currentScroll, key, speed } = this
    const { trimming } = TimelineClipElement
    assertDefined<Trimming>(trimming)

    const { clickedScroll, clickedX, clickedValue } = trimming
    const isFrames = key === $FRAMES
    
    const pixelDelta = currentX - (clickedX + clickedScroll - currentScroll)
    const frameDelta = pixelToFrame(pixelDelta, this.scale)
    if (isFrames) return Math.max(1, Math.round(clickedValue + frameDelta))

    const { selectable: target } = this
    assertClientAudibleInstance(target)

    const frameDeltaSped = frameDelta * speed
    const durationFrames = target.asset.frames(Number(target.clip.track!.mash.value('quantize')))
    
    const value = clickedValue - (frameDeltaSped / durationFrames)

    return Math.max(0, value)
  }
  private handlePointerDown = (event: PointerEvent) => {
    eventStop(event)

    // must first select clip
    this.selectClip()

    // set trimming state
    const { clientX: clickedX } = event
    const { propertyId } = this
    const scalarEvent = new EventScalar(propertyId)
    MOVIE_MASHER.dispatch(scalarEvent)
    const { value: clickedValue } = scalarEvent.detail
    assertPositive(clickedValue) 

    const { scrollCurrent: clickedScroll, key } = this
    TimelineClipElement.trimming = { clickedX, clickedValue, clickedScroll, key }

    // attach move and up listeners
    globalThis.window.addEventListener('pointermove', this.handlePointerMove)
    globalThis.window.addEventListener('pointerup', this.handlePointerUp)

    // add trimming class to host
    this.classList.toggle(TRIMMING, true)
  }


  private handleResize(entries: ResizeObserverEntry[]): Size { 
    const { sizeWhenUpdated: drawnSize } = this

    for (const entry of entries) {
      const copy = copySize(entry.contentRect)
      this.clipSize = copy
      if (copy.height !== drawnSize.height || copy.width > drawnSize.width) {
        this.handleChange()
      }
      return copy
    }
    return SIZE_ZERO
  }

  private handleTimeout = () => {
    delete this.timeout 
    const { hasChanged } = this
    if (hasChanged) { 
      // console.log(this.tagName, 'handleTimeout calling handleChange because hasChanged')
      return this.handleChange()
    }
    const { waitingPromise } = this
    assertDefined(waitingPromise)
  
    const iconPromise = waitingPromise.then(orError => {
      // console.log(this.tagName, 'iconPromise', orError)
      if (iconPromise !== this.iconFromFramePromise) {
        // console.warn(this.tagName, 'handleTimeout', 'iconPromise !== this.iconFromFramePromise')
        return
      }
      delete this.iconFromFramePromise
      if (this.hasChanged) this.timeoutStart()
      if (isDefiniteError(orError)) return 

      const contentElement = this.element('div.content')
      contentElement.replaceChildren(orError.data)
    })
    this.iconFromFramePromise = iconPromise
  }
  
  private hasChanged = true

  private _hover = false
  private get hover(): boolean { return this._hover }
  private set hover(value: boolean) {
    if (this._hover === value) return

    this._hover = value
    this.classList.toggle(HOVERING, value)
  }

  private iconFromFramePromise?: Promise<void>

  private intersectionController?: IntersectionController<boolean>

  private intersecting = false

  private _key?: string

  private get key(): string {
    if (this._key) return this._key

    if (!this.trimsEnd) return this._key = 'startTrim'
    return this._key = this.targetId === $CLIP ? $FRAMES : 'endTrim'
  }

  label?: string

  left = 0

  override mashIndex(event: DragEvent): ClipLocation | undefined {
    const { trackIndex, scale, left: x, clipId } = this
    return droppedMashIndex(event.dataTransfer!, trackIndex, scale, x, clipId)
  }

  maxWidth = 0

  override onclick = (event: Event) => { event.stopPropagation() }
  
  override ondragend = (event: DragEvent) => {
    eventStop(event)
    const { dataTransfer } = event
    if (!dataTransfer) return
    
    const { dropEffect } = dataTransfer
    if (dropEffect === $NONE) {
      const { clipId } = this
      MOVIE_MASHER.dispatch(new EventRemoveClip(clipId))
    }
  }

  override ondragstart = (event: DragEvent) => {
    const { dataTransfer, clientX } = event
    if (!dataTransfer) return

    const { left } = this
    const offset =  clientX - left
    const data = { offset }
    // console.log(this.tagName, 'ondragstart', offset, '=', clientX, '-', x, '=', clientX - x)
    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData(`${$CLIP}${X_MOVIEMASHER}`, jsonStringify(data))
    event.stopPropagation()

  }

  override onpointerenter = () => {
    if (!TimelineClipElement.trimming) this.hover = true
  }

  override onpointerleave = () => {
    if (!TimelineClipElement.trimming) this.hover = false
  }

  override onpointerdown = (event: PointerEvent) => {
    event.stopPropagation()
    this.selectClip()
  }

  private get options(): BooleanRecord { 
    return MOVIE_MASHER.options.timeline || {} 
  }

  private get propertyId(): PropertyId {
    const { targetId, key } = this
    assertDefined(targetId)
    return `${targetId}${DOT}${key}`
  }

  private resizeController?: ResizeController<Size>

  private trimContent(): OptionalContent {
    const { trimsStart, trimsEnd } = this
    if (!(trimsStart || trimsEnd)) return

    const contents: TemplateContents = []
    if (trimsStart) {
      contents.push(html`<div 
        class='trim start'
        @pointerdown='${this.handlePointerDown}'
      ></div>`)
    }
    if (trimsEnd) {
      contents.push(html`<div 
        class='trim end'
        @pointerdown='${this.handlePointerDown}'
      ></div>`)
    }
    return html`${contents}`
  }

  private _trimsEnd?: boolean
  private get trimsEnd(): boolean {
    if (isDefined<boolean>(this._trimsEnd)) return this._trimsEnd

    return this._trimsEnd = this.trimsEndInitialize
  }

  private get trimsEndInitialize(): boolean {
    const { targetId } = this
    if (!targetId) return false

    // timing is custom 
    if (targetId === $CLIP) return true

    const { selectable: selectable } = this
    if (!selectable) return false

    return isClientAudibleInstance(selectable)
  }

  private _trimsStart?: boolean
  private get trimsStart(): boolean {
    if (isDefined<boolean>(this._trimsStart)) return this._trimsStart

    return this._trimsStart = this.trimsStartInitialize
  }

  private get trimsStartInitialize(): boolean {
    const { selectable: selectable } = this
    // console.log(this.tagName, 'trimsStartInitialize', selectable && selectable.value('label'))
    return isClientAudibleInstance(selectable)
  }

  private static trimming?: Trimming

  scale = 0

  private get scrollCurrent(): number {
    const { scrollRoot } = this
    if (!scrollRoot) return 0

    const { scrollLeft } = scrollRoot
    return scrollLeft
  }
  
  private _scrollRoot?: Element | false
  private get scrollRoot(): Element | false {
    if (isDefined<Element | false>(this._scrollRoot)) return this._scrollRoot
    
    const rootEvent = new EventScrollRoot()
    this.dispatchEvent(rootEvent)
    return this._scrollRoot = rootEvent.detail.root || false
  }

  private selectClip() {
    const clipEvent: StringEvent = new EventChangeClipId(this.clipId)
    MOVIE_MASHER.dispatch(clipEvent)
  }

  private get selectable(): Propertied {
    const { clip, targetId } = this
    assertClientClip(clip)
    
    switch (targetId) {
      case $CLIP: return clip
      case $CONTAINER: return clip.container!
      case $CONTENT: return clip.content
    }
    errorThrow(`invalid targetId ${targetId}`)
  }

  private sizeWhenUpdated = { ...SIZE_ZERO }
 
  private _speed?: number
  private get speed(): number {
    if (isDefined<number>(this._speed)) return this._speed
    
    const { clip } = this
    const value = clip.value('speed') || 1.0
    assertPositive(value)
    
    return this._speed = value
  }
  
  private get targetId(): TargetId {
    const { timing } = this
    return isTargetId(timing) ? timing : $CLIP
  }

  private timeout?: Timeout 

  private timeoutRate = 100
  
  private timeoutStart = () => {
    if (this.timeout) return

    this.timeout = setTimeout(() => this.handleTimeout(), this.timeoutRate)
  }

  private _timing?: Timing 
  private get timing(): Timing  {
    if (this._timing) return this._timing
    const value = this.clip.value('timing')
    assertTiming(value)

    return this._timing = value 
  }

  trackIndex = -1

  trackWidth = 0

  private waitingPromise?: Promise<DataOrError<SvgElement>>

  width = 0

  protected override willUpdate(values: PropertyValues<this>): void {
    super.willUpdate(values)
    const changedClip = values.has('clipId')
    if (changedClip) {
      delete this._clip
      delete this._timing
      delete this._trimsStart
      delete this._trimsEnd
      delete this._speed
      delete this._key
    }
    if (
      changedClip || TimelineClipElement.watched.some(value => values.has(value))
    ) this.handleChange()
  }

  static handleClipElement(event: EventClipElement) {
    const { detail } = event
    const { element } = detail
    const instance = isTimelineClipElement(element) ? element : TimelineClipElement.instance()
    detail.element = TimelineClipElement.instanceUpdate(instance, detail)
    event.stopImmediatePropagation()
  }

  static instance() {
    return document.createElement(TimelineClipTag)
  }

  static instanceUpdate(element: TimelineClipElement, detail: EventClipElementDetail) {
    const { 
      clipId, left, label, width, trackIndex, scale, maxWidth, trackWidth,
    } = detail
    
    element.trackIndex = trackIndex
    element.maxWidth = maxWidth
    element.scale = scale
    element.trackWidth = trackWidth
    element.label = label
    element.label = label
    element.clipId = clipId
    element.draggable = true 
    element.left = left
    element.width = width
    element.setAttribute('style', `width:${width}px;left:${left}px;`)
    return element 
  }

  static override properties: PropertyDeclarations = { 
    ...SIZE_REACTIVE_DECLARATIONS,
    clipId: { type: String, attribute: 'clip-id' }, label: { type: String },  
    trackWidth: { type: Number, attribute: 'track-width', reflect: false },
    trackIndex: { type: Number, attribute: 'track-index', reflect: false },
    maxWidth: { type: Number, attribute: 'max-width', reflect: false },
    left: { type: Number }, width: { type: Number },
    scale: { type: Number, reflect: false },
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    css`
      :host {
        --pad: var(--pad-label);
        --height: var(--height-label);
        --height-text: calc(var(--height) - (2 * var(--pad)));
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0px;
        bottom: 0px;
        overflow: hidden;
    
        border-radius: var(--radius-border);
     
        border: var(--border);
        border-color: var(--back);
        color: var(--back);
        background-color: var(--fore);
        display: inline-block;
        flex-grow: 1;

        /* https://github.com/react-dnd/react-dnd/issues/832 */
        transform: translate3d(0, 0, 0);
      }

      :host > div.drop-box {
        display: none;
        position: absolute;
        inset: 0px;
        cursor: grab;
      }

      :host(.trimming) > div.drop-box {
        cursor: ew-resize;
      }

      :host(:has(.trimming)) > div.drop-box {
        cursor: ew-resize;
      }

      div.trim {
        display: inline-block;
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: ${TRIM_WIDTH}px;
        cursor: ew-resize;
        pointer-events: fill;
        background-color: var(--over);
        border-radius: var(--radius-border);      
      }

      :host(:is(.dropping, .hovering)) > div.drop-box {
        display: block;
      }

      :host(.dropping) div.trim {
        display: none;
      }
      :host(.hovering) {
        color: var(--over);
        border-color: var(--over);
      }
      
      :host(.hovering) div.content {
        color: var(--over);
      }

      :host(.dropping) div.drop-box {
        box-shadow: var(--dropping-shadow);
      }

      div.trim.start {
        left: 0px;
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
      }

      div.trim.end {
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        right: 0px;
      }
     
      div.content {
        pointer-events: none;
        position: absolute;
      }

      div.content polygon.fore {
        fill: var(--back);
      }
      /* :host(.hovering) div.content polygon.fore {
        fill: var(--over);
      } */

   

      label {
        background-color: var(--back);
        color: var(--fore);
        height: var(--height);
        font-size: var(--height-text);
        line-height: var(--height-text);
        padding: var(--pad);
        position: absolute;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 100%;
        opacity: 0.5;
      }
    `,
  ]

  private static watched: TimelineClipElementKey[] = ['scale', 'trackWidth', 'maxWidth', 'label', 'size', 'width']
}

type TimelineClipElementKey = keyof TimelineClipElement

const isTimelineClipElement = (value: any): value is TimelineClipElement => value instanceof TimelineClipElement


customElements.define(TimelineClipTag, TimelineClipElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimelineClipTag]: TimelineClipElement
  }
}

// listen for timeline clip element event
export const clipClientListeners: ListenersFunction = () => ({
  [EventClipElement.Type]: TimelineClipElement.handleClipElement
})
