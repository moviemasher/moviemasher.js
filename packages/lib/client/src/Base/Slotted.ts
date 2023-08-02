import type { PropertyDeclarations } from 'lit'
import type { Strings } from '@moviemasher/runtime-shared'
import type {  Htmls, Contents, OptionalContent} from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { PipeChar, DashChar } from '@moviemasher/lib-shared'

import { ImporterComponent } from './ImporterComponent'

// import { Component } from './Component'

export class Slotted extends ImporterComponent {
  private get slotChildren() {
    return Array.from(this.children).filter(child => child.slot)
  } 
  
  protected override get defaultContent(): OptionalContent { 
    const rendereds: Contents = []
    const { slotChildren } = this
    this.slots.forEach(childSlot => {
      const slots: Htmls = []
      const childSlotElements = slotChildren.filter(child => 
        child.slot.startsWith(childSlot)
      )
      const terminated = childSlotElements.some(slotChild => { 
        const { slot } = slotChild
        if (slot === childSlot) {
          rendereds.push(html`
            <slot 
              name='${childSlot}' class='${childSlot}'
              @slotchange='${this.slotChangeHandler}'
            ></slot>
          `)
          return true
        } 
        slots.push(html`
          <slot 
            name='${slot}' 
            slot='${slot.split(DashChar).slice(1).join(DashChar)}'
          ></slot>
        `)
        return false
      })
      if (!terminated) {
        const content = this.partContent(childSlot, slots)
        if (content) rendereds.push(content)
      }
    })
    if (rendereds.length) return html`${rendereds}`
  }

  protected partContent(_part: string, slots: Htmls): OptionalContent { 
    return html`${slots}`
  }

  private slotChangeHandler(event: Event) {
    this.importElements(Array.from((event.target as HTMLSlotElement).children))
  }

  protected get slots(): Strings {
    const { parts } = this
    return parts ? parts.split(PipeChar) : []
  }

  parts = ''

  static override properties: PropertyDeclarations = { 
    // ...Component.properties,
    parts: { type: String },
  }
}
