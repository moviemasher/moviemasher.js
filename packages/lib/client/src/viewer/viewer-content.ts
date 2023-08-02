import type { PropertyDeclarations, PropertyValues } from 'lit'
import type { CSSResultGroup } from 'lit'
import type { Timeout } from '@moviemasher/runtime-client'
import type { Content, Contents, OptionalContent } from '../declarations.js'
import type { Point } from '@moviemasher/runtime-shared'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'

import { EventChangedPreviews, EventPreviews, EventChangeClipId, MovieMasher, EventRect } from '@moviemasher/runtime-client'
import { Scroller } from '../Base/Scroller.js'
import { DropTargetMixin } from '../Base/DropTargetMixin.js'
import { DisablableMixin, DisablableProperties } from '../Base/DisablableMixin.js'
import { RectObserverMixin } from '../Base/RectObserverMixin.js'
import { SizeReactiveMixin, SizeReactiveProperties } from '../Base/SizeReactiveMixin.js'
import { assertSizeAboveZero, pointCopy, sizeContain } from '@moviemasher/lib-shared'
import { Component } from '../Base/Component.js'

const ViewerRefreshTics = 10

const WithDropTargetMixin = DropTargetMixin(Scroller)
const WithDisablableMixin = DisablableMixin(WithDropTargetMixin)
const WithRectObserver = RectObserverMixin(WithDisablableMixin)
const WithSizeReactive = SizeReactiveMixin(WithRectObserver)
export class ViewerContentElement extends WithSizeReactive {
  constructor() {
    super()
    this.listeners[EventChangedPreviews.Type] = this.handleChangedPreviewItems.bind(this)
    this.listeners[EventRect.Type] = this.handleRect.bind(this)
  }

  override acceptsClip = false

  protected override content(contents: Contents): Content {
    return html`${contents}`
  }

  protected override get defaultContent(): OptionalContent {
    const { size: mySize } = this
    assertSizeAboveZero(mySize)
    const max = this.variable('max-dimension')
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

  private handleChangedPreviewItems(): void { 
    if (this.watchingTimeout) {
      this.watchingRedraw = true
      return
    }
    // console.log(this.tagName, 'handleDraw SET watchingTimeout')
    this.watchingTimeout = setTimeout(this.requestItemsPromise.bind(this), ViewerRefreshTics)
  }
  

  protected handlePointerDown(event: Event) {
    event.stopPropagation()
    MovieMasher.eventDispatcher.dispatch(new EventChangeClipId())
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

    // TODO: we should send disabled argument to EventPreviews when dragging
    const event = new EventPreviews(this.variable('max-dimension'))
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) {
      console.warn(this.tagName, 'requestItemsPromise NO PROMISE')
      return Promise.resolve()
    }

    return promise.then(svgs => {
      this.element().replaceChildren(...svgs)
      if (this.watchingRedraw) this.handleChangedPreviewItems()
    })
  }

  private watchingRedraw = false

  private watchingTimeout?: Timeout 

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties)
    if (changedProperties.has('size') || changedProperties.has('disabled')) {
      this.handleChangedPreviewItems()
    }
  }

  static override properties: PropertyDeclarations = {
    ...DisablableProperties,
    ...SizeReactiveProperties,
    point: { type: Object, attribute: false },
  }
  
  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    css`
      :host {
        position: relative;
      }
      div.root {
        padding: 0px;
        flex-grow: 1;
        /* position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0; */
      }
    `,
    Scroller.cssDivDropping,
    css`
      div.root {
        display: block;
        /* overflow: hidden; */
        /* border: var(--border);
        border-radius: var(--border-radius);
        border-color: var(--fore-secondary);
        color: var(--fore-secondary);
        background-color: var(--control-back); */   
    
        /* pointer-events: none; */
        /* width: var(--viewer-width);
        height: var(--viewer-height); */
        margin-inline: auto;
        color: var(--div-fore);
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

      div.root > svg.bounds,
      div.root > svg.background,
      div.root > svg.track {
        pointer-events: none;
      }

      div.root > svg .outline {
        cursor: move;
        pointer-events: visibleFill;
        stroke-width: 0;
        fill: transparent;
      }

      div.root > svg .outline.animate:hover {
        stroke-width: calc(2 * var(--border-size));
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
        stroke-width: calc(2 * var(--border-size));

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

// register web component as custom element
customElements.define('movie-masher-viewer-content', ViewerContentElement)



    /* 
    @supports (-moz-appearance:none) {
      .moviemasher .preview.panel .content > svg .filtered {
        filter: none;
      }
      .moviemasher .preview.panel .content > svg use.mozilla  {
        stroke-width: var(--border-size);
        stroke: black;
        fill: white;
      }
    }
    @supports not (-moz-appearance:none) {
      .moviemasher .preview.panel .content > svg use.mozilla {
        display: none;
      }
    } */
