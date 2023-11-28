import type { ClientClips, ClipLocation, DropTarget } from '@moviemasher/runtime-client'
import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { Content, Contents, OptionalContent } from '../Types.js'

import { ResizeController } from '@lit-labs/observers/resize-controller.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { isPositive } from '@moviemasher/lib-shared/utility/guards.js'
import { EventChanged, EventClipElement, EventTrackClips, INDEX_LAST, MOVIEMASHER, EventScrollRoot } from '@moviemasher/runtime-client'
import { html } from 'lit-html'
import { Component, ImporterComponent } from '../base/Component.js'
import { DropTargetMixin } from '../mixins/component.js'
import { dragData, droppingFiles } from '../utility/draganddrop.js'
import { pixelFromFrame, pixelToFrame } from '../utility/pixel.js'

const droppedMashIndex = (dataTransfer: DataTransfer, trackIndex = INDEX_LAST, scale = 0, offsetDrop = 0, clipId = ''): ClipLocation => {
  //  eg. offsetDrop = scrollX + clientX - viewX   
  const files = droppingFiles(dataTransfer)
  const clientClips: ClientClips = []
  let isDense = false
  if (isPositive(trackIndex)) {
    const event = new EventTrackClips(trackIndex)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { clips, dense } = event.detail
    if (clips) {
      clientClips.push(...clips)
      isDense = !!dense
    }
  }
  const location: ClipLocation = { track: trackIndex }
  if (isDense) {
    if (clipId) {
      location.index = clientClips.findIndex(clip => clip.id === clipId) + 1
    } else location.index = INDEX_LAST
  } else {
    const data = files ? { offset: 0 } : dragData(dataTransfer)
    location.frame = pixelToFrame(Math.max(0, offsetDrop - data.offset), scale)
  }
  return location
}

const WithDropTargetMixin = DropTargetMixin(ImporterComponent)

const TimelineTrackTag = 'movie-masher-timeline-track'
/**
 * @category Component
 */
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
    const event = new EventTrackClips(trackIndex)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { clips } = event.detail
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
        MOVIEMASHER.eventDispatcher.dispatch(event)
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

  override mashIndex(event: DragEvent): ClipLocation | undefined {
    const { dataTransfer } = event

    const rootEvent = new EventScrollRoot()
    this.dispatchEvent(rootEvent)
    const { root } = rootEvent.detail
    if (!root) return super.mashIndex(event)

    const { clientX } = event
    const scrollX = root.scrollLeft ?? 0
    const { trackIndex, scale, x } = this
    const offsetDrop = scrollX + clientX - x
    // console.log(this.tagName, 'mashIndex', { scale, offsetDrop, scrollX, clientX, x })

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
