import type { EventClipElementDetail, ScrollRootEventDetail, StringEvent, SvgOrImageDataOrError, Timeout } from '@moviemasher/runtime-client'
import type { Size } from '@moviemasher/runtime-shared'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit'
import type { Contents, DropTarget, OptionalContent } from '../declarations.js'

import { IntersectionController } from '@lit-labs/observers/intersection-controller.js'
import { ResizeController } from '@lit-labs/observers/resize-controller.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { assertDefined, isMashAsset, sizeCopy } from '@moviemasher/lib-shared'
import { DragSuffix, EventChangeClipId, EventChanged, EventClipElement, EventTrackClipIcon, EventRemoveClip, EventTypeScrollRoot, MovieMasher, eventStop } from '@moviemasher/runtime-client'
import { SIZE_ZERO, TARGET_CLIP, MASH, isDefiniteError } from '@moviemasher/runtime-shared'
import { html } from 'lit-html/lit-html.js'
import { Component } from '../Base/Component.js'
import { DropTargetMixin } from '../Base/DropTargetMixin.js'
import { ImporterComponent } from '../Base/ImporterComponent.js'
import { SizeReactiveMixin, SizeReactiveProperties } from '../Base/SizeReactiveMixin.js'
import { isChangeAction } from '../Client/Masher/Actions/Action/ActionFunctions.js'
import { isClientClip } from '../Client/Mash/ClientMashGuards.js'
import { isClientInstance } from '../Client/ClientGuards.js'

export const TimelineClipName = 'movie-masher-timeline-clip'

const WithDropTargetMixin = DropTargetMixin(ImporterComponent)
const WithSizeReactiveMixin = SizeReactiveMixin(WithDropTargetMixin)
export class ComposerClipElement extends WithSizeReactiveMixin implements DropTarget {
  constructor() {
    // console.log('ComposerClipElement')
    super()
    this.listeners[EventChanged.Type] = this.handleChanged.bind(this)
  }
  
  clipId = ''

  override connectedCallback(): void {
    super.connectedCallback()
    const detail: ScrollRootEventDetail = {}
    const init: CustomEventInit<ScrollRootEventDetail> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    const event = new CustomEvent(EventTypeScrollRoot, init)
    this.dispatchEvent(event)
    const { root } = detail
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
    const contents: Contents = []
    // const { size } = this
    // const { width, height } = size
    const { label, labels } = this
    if (label && labels) contents.push(html`<label>${label}</label>`)
    contents.push(html`
      <div class='svg'></div>
      <div class='background'></div>
    `)
      // <svg width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'></svg>
    contents.push(html`<div class='drop-box'></div>`)
    return html`${contents}`
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    delete this.intersectionController
    delete this.resizeController
  }

  protected override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties)
    
    // console.log(this.tagName, 'firstUpdated calling drawBackground', this.hasChanged)
    this.drawBackgroundAndUpdate()
  }

  private drawBackgroundAndUpdate() {
    this.hasChanged = false 
    // console.log(this.tagName, 'drawBackground')
    const { clipId, scale, clipSize, gap } = this
    this.sizeWhenUpdated = sizeCopy(clipSize)
    const event = new EventTrackClipIcon(clipId, clipSize, scale, gap)
    MovieMasher.eventDispatcher.dispatch(event)

    const { promise, background } = event.detail
    // console.log('drawBackgroundAndUpdate', !!promise)
    if (!(promise && background)) return 
  
    const svgElement = this.element('div.background')
    svgElement.replaceChildren(background)
    this.waitingPromise = promise
    this.startTimeout()
  }

  private gap = 2

  private handleChange = () => { 
    if (!this.intersecting) {
      // console.log(this.tagName, 'handleChange !intersecting')
      this.hasChanged = true 
      return
    }

    // console.log(this.tagName, 'handleChange calling drawBackground')
    this.drawBackgroundAndUpdate()
  }

  private handleChanged(event: EventChanged): void {
    const { detail: action } = event
    if (!isChangeAction(action)) return

    const { target, affects } = action
    if (isMashAsset(target)) {
      if (!affects.includes(`${MASH}.color`)) return
    } else {
      const isClip = isClientClip(target)
      const isInstance = !isClip && isClientInstance(target)
      if (!(isClip || isInstance)) return

      const clip = isClip ? target : target.clip
      if (clip.id !== this.clipId) return
    }  
    this.handleChange()
  }

  override handleDropped(_event: DragEvent): void {
    // we do nothing here so timeline track handles the drop event
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
  
  private handleResize(entries: ResizeObserverEntry[]): Size { 
    const { sizeWhenUpdated: drawnSize } = this

    for (const entry of entries) {
      const size = sizeCopy(entry.contentRect)
      this.clipSize = size
      if (size.height !== drawnSize.height || size.width > drawnSize.width) {
        // console.log(this.tagName, 'handleResize calling handleChange because size !== sizeWhenUpdated')
        this.handleChange()
      }
      return size
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
      if (this.hasChanged) this.startTimeout()
      if (isDefiniteError(orError)) return 

      const svgElement = this.element('div.svg')
      svgElement.replaceChildren(orError.data)
    })
    this.iconFromFramePromise = iconPromise
  }
  
  private hasChanged = true

  private iconFromFramePromise?: Promise<void>

  icons?: boolean

  private intersectionController?: IntersectionController<boolean>

  private intersecting = false

  label?: string

  labels?: boolean

  maxWidth = 0

  override onclick = (event: Event) => { event.stopPropagation() }
  
  override ondragend = (event: DragEvent) => {
    // console.log(this.tagName, 'ondragend')
    eventStop(event)
    const { dataTransfer } = event
    if (!dataTransfer) return
    
    const { dropEffect } = dataTransfer
    if (dropEffect === 'none') {
      const { clipId } = this
      MovieMasher.eventDispatcher.dispatch(new EventRemoveClip(clipId))
    }
  }

  override ondragstart = (event: DragEvent) => {
    // console.log(this.tagName, 'ondragstart', event.target)
    this.onpointerdown(event)

    const { dataTransfer, clientX } = event
    if (!dataTransfer) return

    const rect = this.getBoundingClientRect()
    const { left } = rect
    // const { clipSize } = this
    // if (target instanceof Element) {
    //   target.setAttribute('style', `width:${clipSize.width}px;`)
    // }
    const data = { offset: clientX - left }
    const json = JSON.stringify(data)
    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData(`${TARGET_CLIP}${DragSuffix}`, json)
  }

  override onpointerdown = (event: Event) => {
    event.stopPropagation()
    const { clipId } = this
    const clipEvent: StringEvent = new EventChangeClipId(clipId)
    MovieMasher.eventDispatcher.dispatch(clipEvent)
  }

  private resizeController?: ResizeController<Size>

  scale = 0

  private clipSize = { ...SIZE_ZERO } 

  private sizeWhenUpdated = { ...SIZE_ZERO }

  trackIndex = -1

  trackWidth = 0

  private startTimeout = () => {
    if (this.timeout) return

    this.timeout = setTimeout(() => this.handleTimeout(), this.timeoutRate)
  }
 
  private timeout?: Timeout 

  private timeoutRate = 100
  
  private waitingPromise?: Promise<SvgOrImageDataOrError>

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties)
    if (
      changedProperties.has('clipId')
      || changedProperties.has('scale')
      || changedProperties.has('trackWidth')
      || changedProperties.has('maxWidth')
      || changedProperties.has('label')
      || changedProperties.has('size')
    ) this.handleChange()
  }

  x = 0

  static handleClipElement(event: EventClipElement) {
    const { detail } = event
    detail.node = ComposerClipElement.instance(detail)
    event.stopImmediatePropagation()
  }

  static instance(detail: EventClipElementDetail) {
    const { clipId, x, label, width, trackIndex, scale, maxWidth, trackWidth, labels, icons } = detail

    const element = document.createElement(TimelineClipName)
    element.x = x
    element.trackIndex = trackIndex
    element.maxWidth = maxWidth
    element.scale = scale
    element.trackWidth = trackWidth
    element.label = label
    element.labels = labels
    element.label = label
    element.icons = icons
    element.clipId = clipId
    element.draggable = true 
    element.setAttribute('style', `left:${x}px;width:${width}px;`)
    return element
  }

  static override properties: PropertyDeclarations = { 
    ...SizeReactiveProperties,
    clipId: { type: String, attribute: 'clip-id' }, 
    label: { type: String, attribute: true },  
    scale: { type: Number, attribute: true },
    trackWidth: { type: Number, attribute: 'track-width' },
    trackIndex: { type: Number, attribute: 'track-index' },
    maxWidth: { type: Number, attribute: 'max-width' },
    x: { type: Number },
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    css`
      :host {
        --pad: var(--pad-label);
        --height: var(--height-label);
        --height-text: calc(var(--height) - (2 * var(--pad)));

        cursor: grab;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0px;
        bottom: 0px;
        overflow: hidden;
    
        border-radius: var(--radius-border);
     
        color: var(--fore);
        border: var(--border);
        border-color: var(--fore);
        display: inline-block;
        flex-grow: 1;

        /* https://github.com/react-dnd/react-dnd/issues/832 */
        transform: translate3d(0, 0, 0);
      }

      div.drop-box {
        display: block;
        position: absolute;
        inset: 0px;
      }

      div.svg {
        position: absolute;
      }

      :host(.dropping) div.drop-box {
        box-shadow: var(--dropping-shadow);
      }

      :host(:hover) {
        color: var(--over);
        border-color: var(--over);
      }
      
      label {
        background-color: var(--fore);
        color: var(--back);
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
}

// register web component as custom element
customElements.define(TimelineClipName, ComposerClipElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimelineClipName]: ComposerClipElement
  }
}

// listen for clip element event
export const ClientClipElementListeners = () => ({
  [EventClipElement.Type]: ComposerClipElement.handleClipElement
})


