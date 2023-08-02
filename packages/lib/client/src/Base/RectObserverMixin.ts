import type { Constrained, Rect } from '@moviemasher/runtime-shared'
import type { RectObserver } from '../declarations.js'

import { Component } from './Component.js'

export function RectObserverMixin
<T extends Constrained<Component>>(Base: T): 
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
