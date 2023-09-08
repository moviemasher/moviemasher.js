import type { TrackClipsEventDetail } from '@moviemasher/runtime-client'
import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { Content, Contents, DropTarget, OptionalContent } from '../declarations.js'

import { ResizeController } from '@lit-labs/observers/resize-controller.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { isPositive } from '@moviemasher/lib-shared'
import { EventChanged, EventClipElement, EventTypeScrollRoot, EventTypeTrackClips, MovieMasher, ScrollRootEventDetail } from '@moviemasher/runtime-client'
import { html } from 'lit-html/lit-html.js'
import { Component } from '../Base/Component.js'
import { DropTargetMixin } from '../Base/DropTargetMixin.js'
import { ImporterComponent } from '../Base/ImporterComponent.js'
import { droppedMashIndex } from '../utility/draganddrop.js'
import { pixelFromFrame } from '../utility/pixel.js'

export const TimelineTrackName = 'movie-masher-timeline-track'
const WithDropTargetMixin = DropTargetMixin(ImporterComponent)
export class TimelineTrackElement extends WithDropTargetMixin implements DropTarget {
  constructor() {
    super()
    this.listeners[EventChanged.Type] = this.handleChanged.bind(this)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.resizeController = new ResizeController<number>(
      this, { target: this, callback: this.handleResize.bind(this) }
    )
  }

  protected override content(contents: Contents): Content {
    return html`
      <div @drag-handled='${this.handleDragged}'>${contents}</div>
    `
  }

  protected override get defaultContent(): OptionalContent { 
    const { trackIndex, scale, width: trackWidth, maxWidth, elementsById: elememntsById } = this
    if (!(isPositive(trackIndex) || isPositive(scale))) return 

    const contents: Contents = []
    const detail: TrackClipsEventDetail = { trackIndex }
    const event = new CustomEvent(EventTypeTrackClips, { detail })
    MovieMasher.eventDispatcher.dispatch(event)
    const { clips } = detail
    const labels = true
    const icons = true
    const byId: Record<string, Element> = {}
    if (clips?.length) {
      // this.importTags('movie-masher-timeline-clip')
      clips.forEach(clip => { 
        const { frames, frame, label } = clip
        const width = pixelFromFrame(frames, scale, 'floor')
        const x = pixelFromFrame(frame, scale, 'floor')
        const existing = elememntsById[clip.id]
        if (existing) {
          byId[clip.id] = existing
          existing.setAttribute('style', `left:${x}px;width:${width}px;`)
          existing.setAttribute('scale', String(scale))
          existing.setAttribute('track-width', String(trackWidth)) 
          existing.setAttribute('track-index', String(trackIndex))
          existing.setAttribute('max-width', String(maxWidth))
          existing.setAttribute('x', String(x))
          existing.setAttribute('label', label)
          existing.setAttribute('labels', String(labels))
          existing.setAttribute('icons', String(icons))
          contents.push(existing)
          return
        } 
        const event = new EventClipElement(clip.id, maxWidth, scale, trackIndex, trackWidth, width, x, label, labels, icons)
        MovieMasher.eventDispatcher.dispatch(event)
        const { node } = event.detail
        if (!node) return
        byId[clip.id] = node
        // console.log(this.tagName, 'defaultContent', { frames, width: clipWidth, scale })
        contents.push(node)
      })

    }
    this.elementsById = byId
    return html`${contents}`
  }
  
  private elementsById: Record<string, Element> = {}
  
  override disconnectedCallback(): void {
    super.disconnectedCallback()
    delete this.resizeController
  }

  private handleChanged(_event: EventChanged): void {
    this.requestUpdate()
  }
  
  private handleResize(entries: ResizeObserverEntry[]): number { 
    for (const entry of entries) {
      this.height = entry.contentRect.height 
    }
    return this.height 
  }

  protected height = 0

  maxWidth = 0

  override mashIndex(event: DragEvent) {
    const { dataTransfer } = event
    const detail: ScrollRootEventDetail = {}
    const init: CustomEventInit<ScrollRootEventDetail> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    const rootEvent = new CustomEvent(EventTypeScrollRoot, init)
    this.dispatchEvent(rootEvent)
    const { root } = detail
    if (!root) return super.mashIndex(event)

    const { clientX } = event
    const scrollX = root.scrollLeft ?? 0
    const { trackIndex, scale, x } = this
    const offsetDrop = scrollX + clientX - x

    return droppedMashIndex(dataTransfer!, trackIndex, scale, offsetDrop)
  }
  

  private resizeController?: ResizeController<number>

  scale = 1.0

  trackIndex = -1

  width = 0

  x = 0

  static override properties: PropertyDeclarations = { 
    trackIndex: { type: Number, attribute: 'track-index' },
    height: { type: Number, attribute: false },
    scale: { type: Number },
    width: { type: Number },
    maxWidth: { type: Number, attribute: 'max-width' },
    x: { type: Number },
  }

  static override styles?: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    css`
      :host {
        
        position: relative;
    
        padding: var(--padding);
        /* --drop-size: var(--border-size); */
 
        border: var(--border);
        overflow: hidden;
        background-color: var(--div-back);
        white-space: nowrap;
      }
      :host > div {
        flex: 1;
        display: flex;
      }

      :host(.dropping) {
        box-shadow: var(--dropping-shadow);
      }
      
      .selected {
        background-color: var(--item-back-selected);
      }

       .selected {
        color: var(--item-fore-selected);
        border-color: var(--item-fore-selected);
        background-color: var(--item-back-selected);
      }

       .selected:hover {
        color: var(--item-fore-tertiary);
        border-color: var(--item-fore-tertiary);
        background-color: var(--item-back-tertiary);
      }

    `,
  ]
}


// register web component as custom element
customElements.define(TimelineTrackName, TimelineTrackElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimelineTrackName]: TimelineTrackElement
  }
}
