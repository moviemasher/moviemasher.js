import type { Rect } from '@moviemasher/runtime-shared'
import type { PreviewItemsEvent, PreviewItemsEventDetail, RectEvent, Timeout } from '@moviemasher/runtime-client'
import type { CSSResultGroup } from 'lit'
import type { Content } from '../declarations'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { ResizeController } from '@lit-labs/observers/resize-controller.js'

import { EventTypeDraw, EventTypePreviewItems, EventTypeViewerContentResize, MovieMasher } from '@moviemasher/runtime-client'
import { RectZero, isRect, rectCopy, sizeAboveZero } from '@moviemasher/lib-shared'
import { ImporterComponent } from '../Base/ImporterComponent'

const ViewerRefreshTics = 10

export class ViewerContentElement extends ImporterComponent {
  constructor() {
    super()
    this.listeners[EventTypeDraw] = this.handleDraw.bind(this)
    this.observer = new ResizeController<Rect>(
      this, { callback: this.handleResize.bind(this) }
    )

  }

  private observer?: ResizeController<Rect>

  protected override get defaultContent(): void | Content {
    return html`${this.viewerElements}`
  }

  private disabled = false

  override disconnectedCallback(): void {
    delete this.observer
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
      // console.log(this.tagName, 'requestItemsPromise NO PROMISE')
      return Promise.resolve()
    }

    return promise.then(svgs => {
      // console.log(this.tagName, 'requestItemsPromise PROMISE', svgs.length)

      this.viewerElements = svgs
      // this.requestUpdate()
      if (this.watchingRedraw) this.handleDraw()
    })
  }

  protected viewerElements: Element[] = []

  private watchingRedraw = false

  private watchingTimeout?: Timeout 

  static override properties = {
    ...ImporterComponent.properties,
    viewerElements: { type: Array, attribute: false },
  }
  
  static override styles: CSSResultGroup = [css`
    :host {
      flex-grow: 1;
      display: block;


      position: relative;
      overflow: hidden;
      /* border: var(--border);
      border-radius: var(--border-radius);
      border-color: var(--fore-secondary);
      color: var(--fore-secondary);
      background-color: var(--control-back); */   
  
      pointer-events: none;
      width: var(--viewer-width);
      height: var(--viewer-height);
      margin-inline: auto;
      color: var(--div-fore);
      position: relative;
    }

    :host > .svgs {
      position: relative;
    }


    :host > svg,
    :host > div {
      position: absolute;
      left: 0px;
      top: 0px;
    }

    :host > svg.bounds,
    :host > svg.background,
    :host > svg.track {
      pointer-events: none;
    }

    :host > svg .outline {
      cursor: move;
      pointer-events: VisibleFill;
      stroke-width: 0;
      fill: transparent;
    }

    :host > svg .outline.animate:hover {
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
  `]
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
