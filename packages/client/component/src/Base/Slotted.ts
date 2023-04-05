import type { 
  Htmls, Nodes, Content, Contents, SlottedContent, ConnectionEvent 
} from '../declarations'



import { queryAssignedElements } from '@lit/reactive-element/decorators/query-assigned-elements.js'
import { eventOptions } from '@lit/reactive-element/decorators/event-options.js'



import { html, nothing } from 'lit-html'


import { Importer } from './Importer'
import { ifDefined } from 'lit/directives/if-defined.js'

type SlottedEvent = CustomEvent<SlottedEventDetail>
interface SlottedEventDetail {
  slots: string[]
  paths: Set<string>
}

export class Slotted extends Importer {
  @queryAssignedElements()
  private assignedElements!: Array<HTMLElement>

  private defaultOrSlottedContent(): SlottedContent { 
    const rendereds: Contents = []
    const { slots: mySlots, slottedDetail: detail, } = this
    const { slots: detailSlots, paths: slotsByPath } = detail
    mySlots.forEach(mySlot => {
      const slotPrefixes = [...detailSlots, mySlot]
      const slotPrefix = slotPrefixes.join('-')
      const slots: Htmls = []
      const terminated = Array.from(slotsByPath).some(absolutePath => {
        if (!absolutePath.startsWith(slotPrefix)) return false

        const relativeComponents = absolutePath.split('-').slice(detailSlots.length)
        const name = relativeComponents.join('-')
        const passed = relativeComponents.slice(1).join('-') || undefined
        if (!passed) slots.length = 0
        slots.push(html`<slot 
          name='${name}' 
          slot='${ifDefined(passed)}' 
          @slotchange='${this.onSlotChanged}'
        ></slot>`)
        return !passed
      })
      if (terminated && slots.length) rendereds.push(...slots)
      else {
        const content = this.defaultSlottedContent(mySlot, slots)
        if (content) rendereds.push(content)
      }
    })
    if (rendereds.length) return html`${rendereds}`
  }

  protected defaultSlottedContent(slot: string, slots: Htmls): SlottedContent { 
    return html`${slot}${slots}`
  }

  protected exportsBySlot = new Map<string, string[]>()

  protected exportsForSlot(slot: string) {
    const mapped = this.exportsBySlot.get(slot)
    if (!mapped?.length) return undefined

    return mapped.join(',')
  }
  
  private get slottedDetail(): SlottedEventDetail {
    const detail: SlottedEventDetail = { 
      slots: [], paths: new Set<string>() 
    }
    const init: CustomEventInit<SlottedEventDetail> = { 
      detail, composed: true, bubbles: false, cancelable: true
    }
    const event = new CustomEvent<SlottedEventDetail>('slotted', init)
    this.dispatchEvent(event)
    this.onSlotted(event)
    // console.log(this.constructor.name, 'slottedDetail', detail)
    return detail
  }

  @eventOptions({ capture: true })
  private onSlotChanged() { this.importElements(this.assignedElements) }

  protected onConnection(event: ConnectionEvent) {
    const { exportsBySlot } = this
    
    const { detail } = event
    const { slots, connected, slotted } = detail
    if (connected) {
      const exportTokens = [...slots]
      const mapped = exportTokens.map(exportToken => {
        const rexportedAs = [slotted, exportToken].join('-')
        return [exportToken, rexportedAs].join(':')
      })
      // console.debug(this.constructor.name, 'onConnection connect', slotted, mapped)
      exportsBySlot.set(slotted, mapped)
    }
    else {
      console.debug(this.constructor.name, 'onConnection disconnect')
      exportsBySlot.delete(slotted)    
    }
    this.requestUpdate()
    if (this.slotted && this.slots.length) {
      detail.slotted = this.slotted
      detail.slots = [
        ...this.slots,
        ...this.slots.flatMap(slot => (
          exportsBySlot.get(slot) || []).map(s => String(s.split(':').pop())
        ))
      ]
    } else {
      // console.debug(this.constructor.name, 'onConnection with no part or parts')
      event.stopPropagation()
    }
  }

  protected onSlotted(event: SlottedEvent) {
    const { detail } = event 
    const { slots, paths } = detail
    const { slotted } = this
    if (slotted) slots.push(slotted)
    this.slotsAssignedInChildren.forEach(slot => {
      const key = [...slots, slot].join('-')  
      paths.add(key)
    })
  }

  override render() {
    const { childNodes } = this
    const nodes = Array.from(childNodes)
    const looseNodes: Nodes = nodes.filter(node => {
      if (node instanceof Text) return node.textContent?.trim()
      if (node instanceof Element) return !node.slot
      return false
    })
    const rendereds: Contents = [] 
    if (looseNodes.length) {
      console.log(this.nodeName, 'rendering loose nodes', looseNodes.length, looseNodes)
      rendereds.push(...looseNodes)
    } else {
      const defaultContent = this.defaultOrSlottedContent()
      if (defaultContent) rendereds.push(defaultContent)
    }  
    if (!rendereds.length) return nothing
    
    return this.slottedContent(rendereds)
  }


  private get slotsAssignedInChildren(): string[] {
    const elements = Array.from(this.children)
    const elementSlots = elements.map(element => element.slot)
    const filtered = elementSlots.filter(Boolean)
    const unique = Array.from(new Set(filtered))
    const { slots } = this
    const valid = unique.filter(slot => {
      const [first] = slot.split('-')
      return slots.includes(first)
    })
    return valid
  }

  slottedContent(contents: Contents): Content { return html`${contents}` }

}


