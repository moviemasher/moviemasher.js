import type { Timeout } from '../types.js'
import type { Point } from '@moviemasher/shared-lib/types.js'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit'
import type { TemplateContent, TemplateContents, OptionalContent } from '../client-types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { assertSizeAboveZero, pointCopy, sizeContain } from '@moviemasher/shared-lib/utility/rect.js'
import { MOVIEMASHER } from '@moviemasher/shared-lib/runtime.js'
import { EventChangeClipId, EventChangedPreviews, EventPreviews, EventRect } from '../utility/events.js'
import { html } from 'lit-html'
import { Component } from '../base/Component.js'
import { DisablableMixin, DISABLABLE_DECLARATIONS } from '../mixin/component.js'
import { DROP_TARGET_CSS, DropTargetMixin } from '../mixin/component.js'
import { RectObserverMixin } from '../mixin/component.js'
import { Scroller } from '../base/LeftCenterRight.js'
import { SizeReactiveMixin, SIZE_REACTIVE_DECLARATIONS } from '../mixin/component.js'

const PlayerRefreshTics = 10
export const PlayerContentCenterTag = 'movie-masher-player-content-center'

const WithDropTargetMixin = DropTargetMixin(Scroller)
const WithDisablableMixin = DisablableMixin(WithDropTargetMixin)
const WithRectObserver = RectObserverMixin(WithDisablableMixin)
const WithSizeReactive = SizeReactiveMixin(WithRectObserver)
/**
 * @category Elements
 */
export class PlayerContentCenterElement extends WithSizeReactive {
  constructor() {
    super()
    this.listeners[EventChangedPreviews.Type] = this.handleChangedPreviews.bind(this)
    this.listeners[EventRect.Type] = this.handleRect.bind(this)
  }

  override acceptsClip = false

  protected override templateContent(contents: TemplateContents): TemplateContent {
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
    // console.log(this.tagName, 'deselecting clip')
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

    const event = new EventPreviews(this.variable('size-preview'))
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
        user-select: none;
        /* font-kerning: none; */
      }
      div.root {
        background-color: var(--mash-color);
        padding: 0px;
        flex-grow: 1;
        display: block;
        margin-inline: auto;
        color: var(--fore);
      }

      div.root > svg {
        position: absolute;
        left: 0px;
        top: 0px;
        pointer-events: none;
      }

      div.root > svg.outlines > .outline {
        cursor: move;
        pointer-events: visibleFill;
        stroke-width: 0;
        fill: transparent;
      }

      div.root > svg.outlines > .outline.animate:hover {
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

      div.root > svg.bounds.fore > polygon.handle {
        pointer-events: fill;
      }

      div.root > svg.bounds.fore > polygon.handle:is(.top-right, .bottom-left) {
        cursor: nesw-resize;
      }

      div.root > svg.bounds.fore > polygon.handle:is(.top-left, .bottom-right) {
        cursor: nwse-resize;
      }
      
      div.root > svg.bounds.fore > polygon.handle:is(.top, .bottom) {
        cursor: ns-resize;
      }

      div.root > svg.bounds.fore > polygon.handle:is(.right, .left) {
        cursor: ew-resize;
      } 

      div.root > svg.bounds.back > * {
        stroke-width: calc(2 * var(--size-border));
        stroke: black;
      }

      div.root > svg.bounds.fore > * {
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
