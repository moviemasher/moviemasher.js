import type { NumberEvent } from '@moviemasher/runtime-client'
import type { MashAsset } from '@moviemasher/runtime-shared'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit'
import type { Content, Contents, DropTarget, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { arrayOfNumbers, arrayReversed, assertMashAsset, isPositive } from '@moviemasher/lib-shared'
import { EventChangeClipId, EventChangeFrame, EventChangedFrame, EventChangedMashAsset, EventChangedFrames, EventTypeTracks, EventTypeZoom, MovieMasher, eventStop, EventFrames } from '@moviemasher/runtime-client'
import { ifDefined } from 'lit-html/directives/if-defined.js'
import { html } from 'lit-html/lit-html.js'
import { DisablableMixin } from '../Base/DisablableMixin.js'
import { DropTargetCss, DropTargetMixin } from '../Base/DropTargetMixin.js'
import { Scroller } from '../Base/Scroller.js'
import { pixelToFrame } from '../Client/PixelFunctions.js'
import { pixelFromFrame, pixelPerFrame } from '../utility/pixel.js'

export const TimelineContentName = 'movie-masher-timeline-content'

const WithDisablable = DisablableMixin(Scroller)
const WithDropTargetMixin = DropTargetMixin(WithDisablable)
export class TimelineContentElement extends WithDropTargetMixin implements DropTarget {
  constructor() {
    super()

    this.handleScrubberPointerUp = this.handleScrubberPointerUp.bind(this)
    this.handleScrubberPointerMove = this.handleScrubberPointerMove.bind(this)
    
    this.listeners[EventChangedFrame.Type] = this.handleChangedFrame.bind(this)
    this.listeners[EventChangedFrames.Type] = this.handleChangedFrames.bind(this)
    this.listeners[EventTypeTracks] = this.handleTracks.bind(this)
    this.listeners[EventTypeZoom] = this.handleZoom.bind(this)
  }
  
  private scrubberX = -1

  override connectedCallback(): void {
    const event = new EventFrames()
    MovieMasher.eventDispatcher.dispatch(event)
    const { frames } = event.detail
    this.frames = frames
    super.connectedCallback()
  }

  protected override content(contents: Contents): Content {
    return html`
      <div class='root' @scroll-root='${this.handleScrollRoot}'>
        ${contents}
      </div>
      <div class='drop-box'></div>
    `
  }

  protected override get defaultContent(): OptionalContent { 
    const { framesWidth } = this
    const width = framesWidth > this.width ? `${framesWidth}px` : '100%'
    const contents: Contents = []
    const { tracksLength } = this
    // console.log(this.tagName, 'defaultContent', tracksLength)
    if (tracksLength) {
      const { mashAsset } = this
      assertMashAsset(mashAsset)
      const { tracks } = mashAsset

      this.importTags('movie-masher-timeline-icon')
      this.importTags('movie-masher-timeline-track')
      const indices = arrayReversed<number>(arrayOfNumbers(tracksLength))
      const left = this.left + this.variable('track-width')
      const tracksHtml = indices.map(index => {
        const track = tracks[index]
        const { dense } = track
        return html`
          <movie-masher-timeline-icon 
            track-index='${index}' 
            dense='${ifDefined(dense ? true : undefined)}'
          ></movie-masher-timeline-icon>
      
          <movie-masher-timeline-track 
            track-index='${index}' 
            class='track'
            scale='${this.scale}'
            style='width: ${width};'
            width='${framesWidth}'
            x='${this.x}'
            max-width='${this.width}'
          ></movie-masher-timeline-track>
        `
      })
      contents.push(html`
        <div @drag-handled='${this.handleDragged}' class='tracks'>
          <div 
            class='scrubber-icon'
            @dragenter='${eventStop}' 
            @dragover='${this.handleScrubberDragOver}' 
            @pointerdown='${this.handleScrubberPointerDown}' 
          >
            <div style='left: ${left}px;' class='scrubber-element-icon'></div>
          </div>
          ${tracksHtml}
          <div class='scrubber-bar'>
            <div style='left: ${left}px;' class='scrubber-element-bar'></div>
          </div>
        </div>
      `)
    }
    return html`${contents}`
  }

  override disconnectedCallback(): void {
    this.resizeObserver?.disconnect()
    delete this.resizeObserver
    super.disconnectedCallback()
  }

  override dropValid(data: DataTransfer): boolean {
    return super.dropValid(data) && !this.disabled
  }

  protected override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties)
    const target = this.element('div.drop-box') 
    if (target) {
      this.resizeObserver = new ResizeObserver(this.handleResize.bind(this))
      this.resizeObserver.observe(target)
    }
  }

  frame = 0

  frames = 0

  private framesWidth = 0

  private handleChangedFrame(event: EventChangedFrame): void {
    const { detail: frame } = event
    this.frame = frame
  }

  override handleChangedMashAsset(event: EventChangedMashAsset): void {
    const { detail: mash } = event
    this.mashAsset = mash
    this.tracksLength = mash?.tracks.length || 0
  }
  
  private handleChangedFrames(event: EventChangedFrames): void {
    this.frames = event.detail
  }

  private handleResize(_entries: ResizeObserverEntry[]) {
    const contentRect = this.element('div.drop-box').getBoundingClientRect()
    this.width = contentRect.width
    this.x = contentRect.x
  }

  private handleScrubberDragOver = (event: DragEvent): void => { 
    event.stopPropagation()
  }

  private handleScrubberPointerDown(event: PointerEvent): void {
    event.stopPropagation()
    this.scrubberX = -1
    const { window } = globalThis
    window.addEventListener('pointermove', this.handleScrubberPointerMove)
    window.addEventListener('pointerup', this.handleScrubberPointerUp)
    this.handleScrubberPointerMove(event)
  }

  private handleScrubberPointerMove(event: MouseEvent) {
    // console.log('handlePointerdown', event)
    const trackWidth = this.variable('track-width')

    eventStop(event)
    
    const { clientX } = event
    if (this.scrubberX === clientX) return

    this.scrubberX = clientX

    const rect = this.element('.scrubber-icon').getBoundingClientRect()
    const max = rect.width - trackWidth
    const x = rect.x + trackWidth

    const pixel = Math.max(0, Math.min(max, clientX - x))
    const frame = pixelToFrame(pixel, this.scale, 'floor')
    MovieMasher.eventDispatcher.dispatch(new EventChangeFrame(frame))
  }

  private handleScrubberPointerUp(event: MouseEvent) {
    this.handleScrubberPointerMove(event)
    const { window } = globalThis
    window.removeEventListener('pointermove', this.handleScrubberPointerMove)
    window.removeEventListener('pointerup', this.handleScrubberPointerUp)
  }   

  private handleTracks(event: NumberEvent): void {
    this.tracksLength = event.detail
  }

  private handleZoom(event: NumberEvent): void {
    this.zoom = event.detail
  }

  protected left = 0

  private mashAsset?: MashAsset
  
  override onclick = (): void => {
    MovieMasher.eventDispatcher.dispatch(new EventChangeClipId())
  }

  private recalculateLeft() {
    const { frame, frames, width, zoom } = this
    if (!width) return

    const scale = pixelPerFrame(frames, width, zoom) 
    if (isPositive(scale)) {
      if (this.scale !== scale) this.scale = scale
      this.framesWidth = pixelFromFrame(frames, scale)
      this.left = pixelFromFrame(frame, scale)
    }
  }

  private resizeObserver?: ResizeObserver

  private scale = 0

  protected tracksLength = 0

  width = 0

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (
      changedProperties.has('zoom') 
      || changedProperties.has('width')
      || changedProperties.has('frame')
      || changedProperties.has('frames')
    ) this.recalculateLeft()
  }

  protected x = 0

  zoom = 1.0

  static override properties: PropertyDeclarations = { 
    frame: { type: Number, attribute: false },
    left: { type: Number, attribute: false },
    frames: { type: Number, attribute: false },
    tracksLength: { type: Number, attribute: false },
    width: { type: Number, attribute: false },
    x: { type: Number, attribute: false },
    zoom: { type: Number, attribute: false },
  }

  static override styles: CSSResultGroup = [
    Scroller.styles,
    DropTargetCss,
    css`
      :host {
        isolation: isolate;
      }

      div.root {
        overflow: auto;
        overscroll-behavior: none;
  
        --padding: 1px;
        --spacing: 0px;  
      }

      div.tracks {
        display: grid;
        grid-template-columns: var(--track-width) 1fr;
        grid-template-rows: var(--scrubber-height) repeat(auto-fill, var(--track-height));
        position: relative;
      }

      div.drop-box {
        top: var(--scrubber-height);
        left: var(--track-width);
      }

      div.scrubber-bar,
      div.scrubber-icon {
        display: block;
      }

      div.scrubber-icon {
        top: 0px;
        z-index: 4;
        position: -webkit-sticky;
        position: sticky;
        box-shadow: calc(-1 * var(--track-width)) 0 0 0 var(--section-back);
        --spacing: 4px;
        background-color: var(--section-back);
        grid-column-end: span 2;
      }

      div.scrubber-bar {
        z-index: 2;
        pointer-events: none;
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
      }

      .scrubber-element-bar,
      .scrubber-element-icon {
        position: absolute;
        cursor: pointer;
        background-color: var(--section-fore);
        transition: background-color var(--color-transition);
      }

      .scrubber-element-bar::hover,
      .scrubber-element-icon::hover {
        background-color: var(--fore-hover);
      }

      .scrubber-element-bar {
        width: 1px;
        top: 0px;
        bottom: 0px;
      }

      .scrubber-element-icon {
        --half-width: calc(var(--scrubber-width) / 2);
        margin-left: calc(0px - (var(--scrubber-width) / 2));
        width: var(--scrubber-width);
        height: var(--scrubber-height);
        clip-path: polygon(
          0 var(--spacing),
          var(--scrubber-width) var(--spacing),
          calc(50% + 1px) var(--scrubber-height),
          50% var(--scrubber-height)
        );
      }


      .disabled .scrubber-element-bar,
      .disabled .scrubber-element-icon {
        pointer-events: none;
        cursor: default;
        background-color: var(--control-back-disabled);
      }


      .track-icon {
        border-block: var(--border);
        background-color: var(--section-back);
        color: var(--section-fore);
        display: flex;
        position: -webkit-sticky;
        position: sticky;
        left: 0;
        z-index: 3;
        height: var(--track-height);
      }

      

      .track-icon.selected {
        background-color: var(--item-back-selected);
        color: var(--item-fore-selected);
      }

      .track-icon > * {
        margin: auto;
      }
    `
  ]
}

// register web component as custom element
customElements.define(TimelineContentName, TimelineContentElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimelineContentName]: TimelineContentElement
  }
}
