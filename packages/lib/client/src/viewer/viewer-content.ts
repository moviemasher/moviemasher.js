import type { CSSResultGroup } from 'lit'
import type { Rect } from '@moviemasher/runtime-shared'
import type { PreviewItemsEvent, PreviewItemsEventDetail, RectEvent, Timeout } from '@moviemasher/runtime-client'
import type { Content, Contents, DropTarget } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { ResizeController } from '@lit-labs/observers/resize-controller.js'

import { RectZero, isRect, rectCopy, sizeAboveZero } from '@moviemasher/lib-shared'
import { EventTypeDraw, EventTypePreviewItems, EventTypeViewerContentResize, MovieMasher } from '@moviemasher/runtime-client'
import { ImporterComponent } from '../Base/ImporterComponent.js'
import { Scroller } from '../Base/Scroller.js'
import { DropTargetMixin } from '../Base/DropTargetMixin.js'

const ViewerRefreshTics = 10

const WithDropTargetMixin = DropTargetMixin(Scroller)

export class ViewerContentElement extends WithDropTargetMixin implements DropTarget {

  constructor() {
    super()
    this.listeners[EventTypeDraw] = this.handleDraw.bind(this)
    this.resizeController = new ResizeController<Rect>(
      this, { callback: this.handleResize.bind(this) }
    )
  }

  override acceptsClip = false

  protected override content(contents: Contents): Content {
    return html`${contents}`
  }

  protected override get defaultContent(): void | Content {
    return html`
      <div class='root'></div>
      <div class='drop-box'></div>
    `
  }

  private disabled = false

  override disconnectedCallback(): void {
    delete this.resizeController
    super.disconnectedCallback()
  }

  private handleDraw(): void { 
    if (this.watchingTimeout) {
      if (!this.watchingRedraw) {
        // console.log(this.tagName, 'handleDraw SET watchingRedraw')
        this.watchingRedraw = true
      } else {
        // console.log(this.tagName, 'handleDraw IGNORED')
      }
      return
    }
    // console.log(this.tagName, 'handleDraw SET watchingTimeout')
    this.watchingTimeout = setTimeout(this.requestItemsPromise.bind(this), ViewerRefreshTics)
  }

  private handleResize(entries: ResizeObserverEntry[]): Rect {
    for (const entry of entries) {
      const { contentRect } = entry
      // console.log(this.tagName, 'handleResize', contentRect)
      if (sizeAboveZero(contentRect) && isRect(contentRect)) {
        const rect = rectCopy(contentRect)
        const event: RectEvent = new CustomEvent(EventTypeViewerContentResize, { detail: rect })
        MovieMasher.eventDispatcher.dispatch(event)
        return rect
      }
    }
    return RectZero
  }

  private requestItemsPromise(): Promise<void> {
    // console.log(this.tagName, 'requestItemsPromise')
    const { disabled } = this
    this.watchingRedraw = false
    delete this.watchingTimeout

    const detail: PreviewItemsEventDetail = { disabled }
    const event: PreviewItemsEvent = new CustomEvent(EventTypePreviewItems, { detail })
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = detail
    if (!promise) {
      console.warn(this.tagName, 'requestItemsPromise NO PROMISE')
      return Promise.resolve()
    }

    return promise.then(svgs => {
      const root = this.element()
      root.replaceChildren(...svgs)
      if (this.watchingRedraw) this.handleDraw()
    })
  }

  private resizeController?: ResizeController<Rect>

  private watchingRedraw = false

  private watchingTimeout?: Timeout 

  static override properties = {
    ...ImporterComponent.properties,
  }
  
  static override styles: CSSResultGroup = [
    Scroller.styles,
    Scroller.cssDivDropping,
    css`
      div.root {
        display: block;
        overflow: hidden;
        /* border: var(--border);
        border-radius: var(--border-radius);
        border-color: var(--fore-secondary);
        color: var(--fore-secondary);
        background-color: var(--control-back); */   
    
        /* pointer-events: none; */
        width: var(--viewer-width);
        height: var(--viewer-height);
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
