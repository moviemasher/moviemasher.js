import type { CSSResultGroup } from 'lit'
import type { Content, Contents, DropTarget } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { ResizeController } from '@lit-labs/observers/resize-controller.js'

import { EventTypeAction, EventTypeScrollRoot, EventTypeTrackClips, MovieMasher, ScrollRootEventDetail, TrackClipsEventDetail } from '@moviemasher/runtime-client'
import { isPositive } from '@moviemasher/lib-shared'
import { pixelFromFrame } from '../utility/pixel.js'
import { droppedMashIndex } from '../utility/draganddrop.js'
import { Component } from '../Base/Component.js'
import { ImporterComponent } from '../Base/ImporterComponent.js'
import { DropTargetMixin } from '../Base/DropTargetMixin.js'

const WithDropTargetMixin = DropTargetMixin(ImporterComponent)

export class ComposerTrackElement extends WithDropTargetMixin implements DropTarget {

  constructor() {
    super()
    this.listeners[EventTypeAction] = this.handleAction.bind(this)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.resizeController = new ResizeController<number>(
      this, { target: this, callback: this.handleResize.bind(this) }
    )
  }

  protected override get defaultContent(): Content | void { 
    const { trackIndex, scale, width } = this
    if (!(isPositive(trackIndex) || isPositive(scale))) return 

    const contents: Contents = []
    const detail: TrackClipsEventDetail = { trackIndex }
    const event = new CustomEvent(EventTypeTrackClips, { detail })
    MovieMasher.eventDispatcher.dispatch(event)
    const { clips } = detail
    if (clips?.length) {
      this.importTags('movie-masher-composer-clip')
      clips.forEach(clip => { 
        const { frames, frame, label } = clip

        const clipWidth = pixelFromFrame(frames, scale, 'floor')
        const x = pixelFromFrame(frame, scale, 'floor')
        // console.log(this.tagName, 'defaultContent', { frames, width: clipWidth, scale })
        contents.push(html`
          <movie-masher-composer-clip 
            @drag-handled='${this.handleDragged}' 
            style='left:${x}px;width:${clipWidth}px;' 
            scale='${scale}'
            clip-id='${clip.id}'
            track-width='${width}'
            track-index='${trackIndex}'
            max-width='${this.maxWidth}'
            x='${this.x}'
            label='${label}'
          ></movie-masher-composer-clip>
        `) 
      })
    }
    return html`${contents}`
  }
  
  override disconnectedCallback(): void {
    super.disconnectedCallback()
    delete this.resizeController
  }

  private handleAction(_event: Event): void {
    // console.log(this.tagName, 'handleAction', _event.type)
    this.requestUpdate()
  }
  
  private handleResize(entries: ResizeObserverEntry[]): number { 
    for (const entry of entries) {
      const { contentRect } = entry
      this.height = contentRect.height 
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


  static override properties = { 
    ...Component.properties,
    trackIndex: { type: Number, attribute: 'track-index' },
    height: { type: Number, attribute: false },
    scale: { type: Number },
    width: { type: Number },
    maxWidth: { type: Number, attribute: 'max-width' },
    x: { type: Number },
  }

  static override styles?: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    css`
      :host {
        flex-grow: 1;
        position: relative;
    
        padding: var(--padding);
        /* --drop-size: var(--border-size); */
        display: flex;
        border: var(--border);
        overflow: hidden;
        background-color: var(--div-back);
        white-space: nowrap;
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
customElements.define('movie-masher-composer-track', ComposerTrackElement)

