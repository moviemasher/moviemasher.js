import type { Constrained } from '@moviemasher/runtime-shared'
import type { MashIndex } from '@moviemasher/runtime-client'
import type { DropTarget } from '../declarations.js'

import { CurrentIndex, eventStop } from '@moviemasher/lib-shared'
import { EventTypeDragHandled } from '@moviemasher/runtime-client'
import { dragTypeValid, dropped } from '../utility/draganddrop.js'
import { Component } from './Component.js'


export function DropTargetMixin
<T extends Constrained<Component>>(Base: T): 
T & Constrained<DropTarget> {
  return class extends Base implements DropTarget {
    acceptsClip = true

    handleDragged(): void { this.over = false }

    mashIndex(_event: DragEvent): MashIndex { 
      return { clip: CurrentIndex, track: -1 } 
    }

    override ondragenter = (event: DragEvent): void => {
      eventStop(event)
      const { dataTransfer } = event
      if (!dragTypeValid(dataTransfer, true)) return
      
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
      if (!dragTypeValid(dataTransfer, true)) return

      eventStop(event) 
      this.over = true
    }

    override ondrop = (event: DragEvent): void => {
      this.ondragleave(event)
      const { dataTransfer } = event
      if (!dragTypeValid(dataTransfer, true)) return 
      const mashIndex = this.mashIndex(event)
      console.log(this.tagName, 'ondrop', mashIndex)
      dropped(event, mashIndex)
    }

    
    private _over = false
    get over(): boolean { return this._over }
    set over(value: boolean) {
      if (this._over === value) return
    
      this._over = value
      this.classList.toggle('dropping', value)
    }
  }
}
    