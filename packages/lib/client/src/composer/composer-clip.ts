import type { CSSResultGroup, PropertyValues } from 'lit'
import type { Size, StringEvent } from '@moviemasher/runtime-shared'
import type { IconFromFrameEventDetail, MashIndex, ScrollRootEventDetail, SvgOrImageDataOrError, Timeout } from '@moviemasher/runtime-client'
import type { Content, Contents, DropTarget } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { IntersectionController } from '@lit-labs/observers/intersection-controller.js'
import { ResizeController } from '@lit-labs/observers/resize-controller.js'

import { isDefiniteError } from '@moviemasher/runtime-shared'
import { DragSuffix, EventTypeIconFromFrame, EventTypeMashRemoveClip, EventTypeScrollRoot, EventTypeSelectClip, MovieMasher } from '@moviemasher/runtime-client'

import { SizeZero, assertDefined, eventStop, sizeCopy } from '@moviemasher/lib-shared'

import { Component } from '../Base/Component.js'
import { ImporterComponent } from '../Base/ImporterComponent.js'
import { droppedMashIndex } from '../utility/draganddrop.js'
import { DropTargetMixin } from '../Base/DropTargetMixin.js'

const WithDropTargetMixin = DropTargetMixin(ImporterComponent)

export class ComposerClipElement extends WithDropTargetMixin implements DropTarget {
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
      this.scrollRoot = root
      this.intersectionController = new IntersectionController<boolean>(
        this, { target: this, config: { root }, callback: this.handleIntersection.bind(this) }
      )
    }
    this.resizeController = new ResizeController<Size>(
      this, { target: this, callback: this.handleResize.bind(this) }
    )
  
  }

  protected override get defaultContent(): Content | void { 
    const contents: Contents = []
    // const { size } = this
    // const { width, height } = size
    const { label } = this
    if (label) contents.push(html`<label>${label}</label>`)
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

  override draggable = true

  protected override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties)
    
    console.log(this.tagName, 'firstUpdated calling drawBackground', this.hasChanged)
    this.drawBackground()
  }

  private drawBackground() {
    this.hasChanged = false 
    console.log(this.tagName, 'drawBackground')
    const { clipId, scale, size: clipSize, gap } = this
    this.sizeWhenUpdated = sizeCopy(clipSize)
    const detail: IconFromFrameEventDetail = { clipSize, clipId, gap, scale }
    const event = new CustomEvent(EventTypeIconFromFrame, { detail })
    MovieMasher.eventDispatcher.dispatch(event)

    const { promise, background } = detail
    if (!(promise && background)) return 
  
    const svgElement = this.element('div.background')
    svgElement.replaceChildren(background)
    this.waitingPromise = promise
    this.startTimeout()
  }

  private gap = 2
  private waitingPromise?: Promise<SvgOrImageDataOrError>

  private handleChange = () => { 
    if (!this.intersecting) {
      console.log(this.tagName, 'handleChange !intersecting')
      this.hasChanged = true 
      return
    }

    console.log(this.tagName, 'handleChange calling drawBackground')
    this.drawBackground()
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): boolean {
    const some = entries.some(entry => entry.isIntersecting)
    // console.log(this.tagName, 'handleIntersection', some)
    this.intersecting = some
    if (some && this.hasChanged) {
      console.log(this.tagName, 'handleIntersection calling handleChange')
      this.handleChange()
    }
   
    return some
  }
  
  private handleResize(entries: ResizeObserverEntry[]): Size { 
    const { sizeWhenUpdated: drawnSize } = this

    for (const entry of entries) {
      const size = sizeCopy(entry.contentRect)
      this.size = size
      if (size.height !== drawnSize.height || size.width > drawnSize.width) {
        console.log(this.tagName, 'handleResize calling handleChange because size !== sizeWhenUpdated')
        this.handleChange()
      }
      return size
    }
    return SizeZero
  }

  private handleTimeout = () => {
    delete this.timeout 
    const { hasChanged } = this
    if (hasChanged) { 
      console.log(this.tagName, 'handleTimeout calling handleChange because hasChanged')
      return this.handleChange()
    }
    const { waitingPromise: promise } = this
    assertDefined(promise)
  
    const iconPromise = promise.then(orError => {
      if (iconPromise !== this.iconFromFramePromise) {
        console.warn(this.tagName, 'handleTimeout', 'iconPromise !== this.iconFromFramePromise')
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

  private intersectionController?: IntersectionController<boolean>

  private intersecting = false

  label = ''

  maxWidth = 0

  override onclick = (event: Event) => { event.stopPropagation() }
  
  override ondragend = (event: DragEvent) => {
    console.log(this.tagName, 'ondragend')
    eventStop(event)
    const { dataTransfer } = event
    if (!dataTransfer) return
    
    const { dropEffect } = dataTransfer
    if (dropEffect === 'none') {
      const { clipId } = this
      const event: StringEvent = new CustomEvent(EventTypeMashRemoveClip, { detail: clipId })
      MovieMasher.eventDispatcher.dispatch(event)
    }
  }

  override ondragstart = (event: DragEvent) => {
    console.log(this.tagName, 'ondragstart', event)
    this.onpointerdown(event)

    const { dataTransfer, clientX } = event
    if (!dataTransfer) return

    const rect = this.getBoundingClientRect()
    const { left } = rect

    const data = { offset: clientX - left }
    const json = JSON.stringify(data)
    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData('clip' + DragSuffix, json)
  }

  override mashIndex(event: DragEvent): MashIndex {
    const { dataTransfer } = event
    const { clientX } = event
    const scrollX = this.scrollRoot?.scrollLeft ?? 0
    const { x } = this
    const offsetDrop = scrollX + clientX - x

    const { scale, clipId, trackIndex } = this
   
    return droppedMashIndex(dataTransfer!, trackIndex, scale, offsetDrop, clipId)
  }

  override onpointerdown = (event: Event) => {
    event.stopPropagation()
    const { clipId: detail } = this
    const clipEvent: StringEvent = new CustomEvent(EventTypeSelectClip, { detail })
    MovieMasher.eventDispatcher.dispatch(clipEvent)
  }

  private resizeController?: ResizeController<Size>

  scale = 0

  private scrollRoot?: Element

  private size = { ...SizeZero } 

  private sizeWhenUpdated = { ...SizeZero }

  trackIndex = -1

  trackWidth = 0


  private startTimeout = () => {
    if (this.timeout) return

    this.timeout = setTimeout(() => this.handleTimeout(), this.timeoutRate)
  }
 
  private timeout?: Timeout 
  private timeoutRate = 100

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties)
    if (!changedProperties.size) return
    
    if (
      changedProperties.has('clipId')
      || changedProperties.has('scale')
      || changedProperties.has('trackWidth')
      || changedProperties.has('maxWidth')
      || changedProperties.has('label')
    ) {
      console.log(this.tagName, 'willUpdate calling handleChange')
      this.handleChange()
    }
  }

  x = 0

  static override properties = { 
    ...Component.properties,
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
        cursor: grab;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0px;
        bottom: 0px;
        overflow: hidden;
    
        border-radius: var(--border-radius);
     
        color: var(--item-fore-tertiary);
        border-color: var(--item-fore-tertiary);
        background-color: var(--item-back-tertiary);

        border: var(--border);
        display: inline-block;
        flex-grow: 1;
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

      :host(:hover){
        color: var(--item-fore-hover);
        border-color: var(--item-fore-hover);
        background-color: var(--item-back-hover);
      }
      
      label {
        height: var(--icon-size);
        --padding: 5px;
        position: absolute;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        width: 100%;
        opacity: 0.5;
        padding: var(--padding);
      }
    `,
  ]
}

// register web component as custom element
customElements.define('movie-masher-composer-clip', ComposerClipElement)
