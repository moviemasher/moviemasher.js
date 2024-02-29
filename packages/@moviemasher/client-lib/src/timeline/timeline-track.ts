import type { ClipLocation, DropTarget } from '../types.js'
import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { TemplateContent, TemplateContents, OptionalContent } from '../client-types.js'

import { ResizeController } from '@lit-labs/observers/resize-controller.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { isPositive } from '@moviemasher/shared-lib/utility/guard.js'
import { MOVIE_MASHER } from '@moviemasher/shared-lib/runtime.js'
import { EventEdited, EventClipElement, EventTrackClips, EventScrollRoot } from '../utility/events.js'
import { html } from 'lit-html'
import { Component, ComponentLoader } from '../base/component.js'
import { DropTargetMixin } from '../mixin/component.js'
import { droppedMashIndex } from '../utility/draganddrop.js'
import { pixelFromFrame } from '@moviemasher/shared-lib/utility/pixel.js'

const WithDropTargetMixin = DropTargetMixin(ComponentLoader)

export const TimelineTrackTag = 'movie-masher-timeline-track'
/**
 * @category Elements
 */
export class TimelineTrackElement extends WithDropTargetMixin implements DropTarget {
  constructor() {
    super()
    this.listeners[EventEdited.Type] = this.handleChanged.bind(this)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.resizeController = new ResizeController<number>(
      this, { target: this, callback: this.handleResize.bind(this) }
    )
  }

  protected override templateContent(contents: TemplateContents): TemplateContent {
    return html`
      <div @drag-handled='${this.handleDragged}'>${contents}</div>
    `
  }

  protected override get defaultContent(): OptionalContent { 
    const { trackIndex, scale, width: trackWidth, maxWidth, elementsById } = this
    if (!(isPositive(trackIndex) || isPositive(scale))) return 

    const contents: TemplateContents = []
    const event = new EventTrackClips(trackIndex)
    MOVIE_MASHER.dispatch(event)
    const { clips } = event.detail
    const byId: Record<string, Element> = {}
    if (clips?.length) {
      clips.forEach(clip => { 
        const { frames, frame } = clip
        const label = String(clip.value('label'))
        const width = pixelFromFrame(frames, scale, 'floor')
        const left = pixelFromFrame(frame, scale, 'floor')
        const existing = elementsById[clip.id]
        const event = new EventClipElement(clip.id, maxWidth, scale, trackIndex, trackWidth, width, left, label, existing)
        MOVIE_MASHER.dispatch(event)
        const { element } = event.detail
        if (!element) return
        
        byId[clip.id] = element
        contents.push(element)
      })
    }
    this.elementsById = byId
    return html`${contents}`
  }
  
  override disconnectedCallback(): void {
    super.disconnectedCallback()
    delete this.resizeController
  }

  private elementsById: Record<string, Element> = {}
  
  private handleChanged(_event: EventEdited): void {
    this.requestUpdate()
  }
  
  private handleResize(entries: ResizeObserverEntry[]): number { 
    for (const entry of entries) {
      this.height = entry.contentRect.height 
    }
    return this.height 
  }

  protected height = 0

  override mashIndex(event: DragEvent): ClipLocation | undefined {
    const { dataTransfer } = event

    const rootEvent = new EventScrollRoot()
    this.dispatchEvent(rootEvent)
    const { root } = rootEvent.detail
    if (!root) return super.mashIndex(event)

    const { clientX } = event
    const scrollX = root.scrollLeft || 0
    const { trackIndex, scale } = this
    const offsetDrop = scrollX + clientX 
    return droppedMashIndex(dataTransfer!, trackIndex, scale, offsetDrop)
  }
  
  maxWidth = 0

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
        border: var(--border);
        overflow: hidden;
        background-color: var(--back);
        white-space: nowrap;
      }
      :host > div {
        flex: 1;
        display: flex;
      }

      :host(.dropping) {
        box-shadow: var(--dropping-shadow);
      }

      
    `,
  ]
}

customElements.define(TimelineTrackTag, TimelineTrackElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimelineTrackTag]: TimelineTrackElement
  }
}
