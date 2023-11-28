import type { Timeout } from '@moviemasher/runtime-client'
import type { Point } from '@moviemasher/runtime-shared'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit'
import type { Content, Contents, OptionalContent } from '../Types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { assertSizeAboveZero, pointCopy, sizeContain } from '@moviemasher/lib-shared/utility/rect.js'
import { EventChangeClipId, EventChangedPreviews, EventDragging, EventPreviews, EventRect, MOVIEMASHER } from '@moviemasher/runtime-client'
import { html } from 'lit-html'
import { Component } from '../base/Component.js'
import { DisablableMixin, DISABLABLE_DECLARATIONS } from '../mixins/component.js'
import { DROP_TARGET_CSS, DropTargetMixin } from '../mixins/component.js'
import { RectObserverMixin } from '../mixins/component.js'
import { Scroller } from '../base/LeftCenterRight.js'
import { SizeReactiveMixin, SIZE_REACTIVE_DECLARATIONS } from '../mixins/component.js'

const PlayerRefreshTics = 10
const PlayerContentCenterTag = 'movie-masher-player-content-center'

const WithDropTargetMixin = DropTargetMixin(Scroller)
const WithDisablableMixin = DisablableMixin(WithDropTargetMixin)
const WithRectObserver = RectObserverMixin(WithDisablableMixin)
const WithSizeReactive = SizeReactiveMixin(WithRectObserver)
/**
 * @category Component
 */
export class PlayerContentCenterElement extends WithSizeReactive {
  constructor() {
    super()
    this.listeners[EventChangedPreviews.Type] = this.handleChangedPreviews.bind(this)
    this.listeners[EventRect.Type] = this.handleRect.bind(this)
  }

  override acceptsClip = false

  protected override content(contents: Contents): Content {
    return html`${contents}`
  }

  protected override get defaultContent(): OptionalContent {
    const { size: mySize } = this
    assertSizeAboveZero(mySize)
    const max = this.variable('size-preview')
    const size = sizeContain(mySize, max)
    // console.log(this.tagName, 'defaultContent', size, mySize, max)
    return html`
      <div 
        @pointerdown='${this.handlePointerDown}'
        style='width:${size.width}px;height:${size.height}px;' 
        class='root' 
      ></div>
      <div class='drop-box'></div>
    `
  }

  override dropValid(data: DataTransfer): boolean {
    // TODO: don't allow mash to be dropped into itself
    // here or anywhere within timeline
    return super.dropValid(data) && !this.disabled 
  }

  private handleChangedPreviews(): void { 
    // console.log(this.tagName, 'handleChangedPreviews', !!this.watchingTimeout)
    if (this.watchingTimeout) {
      this.watchingRedraw = true
      return
    }
    this.watchingTimeout = setTimeout(() => this.requestItemsPromise(), PlayerRefreshTics)
  }
  
  protected handlePointerDown(event: Event) {
    event.stopPropagation()
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangeClipId())
  }

  private handleRect(event: EventRect) {
    event.detail.rect = this.rect
    event.stopImmediatePropagation()
  }

  override handleResize() { 
    super.handleResize()
    const { rect } = this
    if (!rect) return

    this.point = pointCopy(rect)
  }

  point?: Point

  private requestItemsPromise(): Promise<void> {
    this.watchingRedraw = false
    delete this.watchingTimeout

    const { disabled } = this
    // console.log(this.tagName, 'requestItemsPromise', disabled)
    if (disabled) return Promise.resolve()
    
    const draggingEvent = new EventDragging()
    MOVIEMASHER.eventDispatcher.dispatch(draggingEvent)
    const dragging = draggingEvent.detail.dragging

    const event = new EventPreviews(this.variable('size-preview'), dragging)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) {
      console.warn(this.tagName, 'requestItemsPromise NO PROMISE')
      return Promise.resolve()
    }

    return promise.then(svgs => {
      // console.log(this.tagName, 'requestItemsPromise', svgs.length)
      this.element().replaceChildren(...svgs)
      if (this.watchingRedraw) this.handleChangedPreviews()
    })
  }

  private watchingRedraw = false

  private watchingTimeout?: Timeout 

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties)
    if (changedProperties.has('size') || changedProperties.has('disabled')) {
      this.handleChangedPreviews()
    }
  }

  static override properties: PropertyDeclarations = {
    ...DISABLABLE_DECLARATIONS,
    ...SIZE_REACTIVE_DECLARATIONS,
    point: { type: Object, attribute: false },
  }
  
  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    DROP_TARGET_CSS,
    css`
      :host {
        position: relative;
      }
      div.root {
        padding: 0px;
        flex-grow: 1;
        display: block;
        margin-inline: auto;
        color: var(--fore);
      }
    
      div.root > .svgs {
        position: relative;
      }


      div.root > svg,
      div.root > div {
        position: absolute;
        left: 0px;
        top: 0px;
        pointer-events: none;
      }

      div.root > svg.background,
      div.root > svg.layer {
        pointer-events: none;
      }

      div.root > svg.bounds {
        pointer-events: visibleFill;
      }
      
      div.root > svg .outline {
        cursor: move;
        pointer-events: visibleFill;
        stroke-width: 0;
        fill: transparent;
      }

      div.root > svg .outline.animate:hover {
        stroke-width: calc(2 * var(--size-border));
        stroke-dasharray: 4px;
        stroke-dashoffset: 8px;
        stroke: white;
        animation: 
          stroke 1s linear infinite forwards,
          color 1s linear 0.5s infinite alternate;
      }


      @keyframes color { to {  stroke: black } }
      @keyframes stroke { to { stroke-dashoffset: 0; } }



      /* 
      :host > svg.bounds .handle.ne {
        cursor: ne-resize;
      }
      :host > svg.bounds .handle.se {
        cursor: se-resize;
      }
      :host > svg.bounds .handle.nw {
        cursor: nw-resize;
      }
      :host > svg.bounds .handle.sw {
        cursor: sw-resize;
      }
      :host > svg.bounds .handle.n {
        cursor: n-resize;
      }
      :host > svg.bounds .handle.s {
        cursor: s-resize;
      }
      :host > svg.bounds .handle.e {
        cursor: e-resize;
      }
      :host > svg.bounds .handle.w {
        cursor: w-resize;
      } */

      :host > svg.bounds.back > * {
        stroke-width: calc(2 * var(--size-border));

        stroke: black;
      }

      :host > svg.bounds.back .handle {
        pointer-events: fill;
      }

      :host > svg.bounds.fore > * {
        stroke: none;
        fill: white;
      }
    `
  ]
}

customElements.define(PlayerContentCenterTag, PlayerContentCenterElement)

declare global {
  interface HTMLElementTagNameMap {
    [PlayerContentCenterTag]: PlayerContentCenterElement
  }
}
