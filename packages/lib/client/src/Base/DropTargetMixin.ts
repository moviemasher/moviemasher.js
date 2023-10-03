import type { Constrained } from '@moviemasher/runtime-shared'
import type { ClipLocation } from '@moviemasher/runtime-client'
import type { DropTarget } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { CurrentIndex, ClassDropping, EventTypeDragHandled, eventStop } from '@moviemasher/runtime-client'
import { dragTypeValid, dropped } from '../utility/draganddrop.js'
import { Component } from './Component.js'


export function DropTargetMixin
<T extends Constrained<Component>>(Base: T): 
T & Constrained<DropTarget> {
  return class extends Base implements DropTarget {
    acceptsClip = true

    dropValid(dataTransfer: DataTransfer | null): boolean { 
      return dragTypeValid(dataTransfer, this.acceptsClip)
    }

    handleDragged(): void { 
      this.over = false
    }

    handleDropped(event: DragEvent): void {
      dropped(event, this.mashIndex(event))
    }

    mashIndex(_event: DragEvent): ClipLocation { 
      return { index: CurrentIndex, frame: 0, track: -1 } 
    }

    override ondragenter = (event: DragEvent): void => {
      eventStop(event)
      const { dataTransfer } = event
      if (!this.dropValid(dataTransfer)) return
      
      const init: CustomEventInit = { composed: true, bubbles: true }
      this.dispatchEvent(new CustomEvent(EventTypeDragHandled, init))
      this.over = true
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
      this.over = false
      const { dataTransfer } = event
      if (!this.dropValid(dataTransfer)) return 

      this.handleDropped(event)
    }

    private _over = false
    private get over(): boolean { return this._over }
    private set over(value: boolean) {
      if (this._over === value) return
    
      this._over = value
      this.classList.toggle(ClassDropping, value)
    }
  }
}

export const DropTargetCss = css`
    :host {
      position: relative;
    }
    
    div.drop-box {
      top: 0;
      left: 0;
      pointer-events: none;
      color: transparent;
      right: 0px;
      bottom: 0px;
      position: absolute;
      display: block;
    }

    :host(.dropping) div.drop-box {
      box-shadow: var(--dropping-shadow);
    }
  `