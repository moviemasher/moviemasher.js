import type { ClipLocation, Disablable, DropTarget, RectObserver, SizeReactive } from '../types.js'
import type { Constrained, Rect, Size } from '@moviemasher/shared-lib/types.js'
import type { CSSResultGroup, PropertyDeclarations } from 'lit'

import { css } from '@lit/reactive-element/css-tag.js'
import { DROPPING, INDEX_CURRENT, eventStop } from '../runtime.js'
import { EventChangedMashAsset, EventChangedSize, EventMashAsset, EventSize } from '../utility/events.js'
import { Component } from '../base/Component.js'
import { dragTypeValid, dropped } from '../utility/draganddrop.js'
import { MOVIEMASHER } from '@moviemasher/shared-lib/runtime.js'

export function DisablableMixin
<T extends Constrained<Component>>(Base: T): 
T & Constrained<Disablable> {
  return class extends Base implements Disablable {
    constructor(...args: any[]) {
      super(...args)
      this.listeners[EventChangedMashAsset.Type] = this.handleChangedMashAsset.bind(this)  
    }

    override connectedCallback(): void {
      super.connectedCallback()
      const event = new EventMashAsset()
      MOVIEMASHER.dispatch(event)
      this.disabled = !event.detail.mashAsset
    }
    
    disabled = true

    handleChangedMashAsset(event: EventChangedMashAsset): void { 
      this.disabled = !event.detail
    }
  }
}

export const DISABLABLE_DECLARATIONS: PropertyDeclarations = {
  disabled: { type: Boolean, attribute: false },
}

const EventTypeDragHandled = 'drag-handled'

export function DropTargetMixin<T extends Constrained<Component>>(Base: T):
  T & Constrained<DropTarget> {
  return class extends Base implements DropTarget {
    acceptsClip = true

    dropValid(dataTransfer: DataTransfer | null): dataTransfer is DataTransfer {
      return dragTypeValid(dataTransfer, this.acceptsClip)
    }

    handleDragged(): void {
      this.over = false
    }

    handleDropped(event: DragEvent): void {
      eventStop(event)
      dropped(event, this.mashIndex(event))
    }

    mashIndex(_event: DragEvent): ClipLocation | undefined {
      return { index: INDEX_CURRENT, frame: 0, track: -1 }
    }

    override ondragenter = (event: DragEvent): void => {
      eventStop(event)
      const { dataTransfer } = event
      if (!this.dropValid(dataTransfer)) return

      const init: CustomEventInit = { composed: true, bubbles: true }
      this.dispatchEvent(new CustomEvent(EventTypeDragHandled, init))
      this.over = true

      const { effectAllowed } = dataTransfer
      // console.log(this.constructor.name, 'ondragenter', { effectAllowed })
      switch (effectAllowed) {
        case 'move': 
        case 'link':
        case 'copy':
          dataTransfer.dropEffect = effectAllowed
          break
      }
    }

    override ondragleave = (event: DragEvent): void => {
      eventStop(event)
      this.over = false
    }

    override ondragover = (event: DragEvent): void => {
      const { dataTransfer } = event
      if (!this.dropValid(dataTransfer)) return

      eventStop(event)
      this.over = true
    }

    override ondrop = (event: DragEvent): void => {
      // console.log('ondrop')
      this.over = false
      const { dataTransfer } = event
      if (!this.dropValid(dataTransfer)) {
        // console.log(this.constructor.name, 'ondrop', 'invalid drop')
        eventStop(event)
        return
      }

      this.handleDropped(event)
    }

    private _over = false
    private get over(): boolean { return this._over }
    private set over(value: boolean) {
      if (this._over === value) return

      this._over = value
      this.classList.toggle(DROPPING, value)
    }
  }
}

export const DROP_TARGET_CSS: CSSResultGroup = [
  css`
    :host {
      position: relative
    }
    
    div.drop-box {
      inset: 0px;
      pointer-events: none;
      color: transparent;
      position: absolute;
      display: block;
    }

    :host(.dropping) div.drop-box {
      box-shadow: var(--dropping-shadow)
    }
  `
]

export function RectObserverMixin<T extends Constrained<Component>>(Base: T):
  T & Constrained<RectObserver> {
  return class extends Base implements RectObserver {
    constructor(...args: any[]) {
      super(...args)
      this.handleResize = this.handleResize.bind(this)
    }

    override connectedCallback(): void {
      this.resizeObserver = new ResizeObserver(this.handleResize)
      this.resizeObserver.observe(this)
      super.connectedCallback()
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback()
      this.resizeObserver?.disconnect()
      delete this.resizeObserver
    }

    handleResize() { this.rect = this.getBoundingClientRect() }

    rect?: Rect

    private resizeObserver?: ResizeObserver
  }
}

export function SizeReactiveMixin<T extends Constrained<Component>>(Base: T):
  T & Constrained<SizeReactive> {
  return class extends Base implements SizeReactive {
    override connectedCallback(): void {
      this.listeners[EventChangedSize.Type] = this.handleChangedSize.bind(this)
      const event = new EventSize()
      MOVIEMASHER.dispatch(event)
      const { size } = event.detail
      if (size) this.size = size
      else {
        const max = this.variable('size-preview')
        this.size = { width: max, height: max }
      }
      super.connectedCallback()
    }

    private handleChangedSize(event: EventChangedSize) {
      this.size = event.detail
    }

    size?: Size
  }
}

export const SIZE_REACTIVE_DECLARATIONS: PropertyDeclarations = {
  size: { type: Object, attribute: false },
}
