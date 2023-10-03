import type { Strings } from '@moviemasher/runtime-shared'
import type { PropertyDeclarations } from 'lit'
import type { Contents, Htmls, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { ImporterComponent } from './ImporterComponent'
import { DASH, PIPE } from '@moviemasher/lib-shared'

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
            slot='${slot.split(DASH).slice(1).join(DASH)}'
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

  parts = ''

  private slotChangeHandler(event: Event) {
    this.importElements(Array.from((event.target as HTMLSlotElement).children))
  }

  protected get slots(): Strings {
    const { parts } = this
    return parts ? parts.split(Slotted.partSeparator) : []
  }

  static partSeparator = PIPE

  static override properties: PropertyDeclarations = { parts: { type: String } }
}
