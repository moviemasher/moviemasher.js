import type { 
  Htmls, Content, Contents, ConnectionEvent, ConnectionEventDetail 
} from '../declarations'

import { html } from 'lit'
import { queryAssignedElements } from 'lit/decorators/query-assigned-elements.js'
import { eventOptions } from 'lit/decorators/event-options.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { property } from 'lit/decorators/property.js'

import { Importer } from './Importer'
import { Component } from './Component'

export type SlottedEvent = CustomEvent<SlottedEventDetail>

export interface SlottedEventDetail {
  slots: string[]
  paths: Set<string>
}

export class Slotted extends Importer {
  @queryAssignedElements()
  protected assignedElements!: Array<HTMLElement>

  private childAdded(child: Element) {
    let slotted = child.getAttribute('slotted') || ''

    if (!slotted) {
      // console.log(this.tagName, 'childAdded', 'NO SLOTTED', child.tagName)
      slotted = child.tagName.split('-').pop()!.toLowerCase()
      child.setAttribute('slotted', slotted)
    }

    const { childrenBySlot } = this
    if (childrenBySlot.has(slotted) && childrenBySlot.get(slotted) !== child) {
      // console.log(this.tagName, 'childAdded', 'ALREADY EXISTS', slotted, child.tagName)
      const count = Object.keys(this.childrenBySlot).filter(key => key.startsWith(slotted)).length
      slotted = `${slotted}${count}`
      child.setAttribute('slotted', slotted)
    }


    // console.log(this.tagName, 'childAdded', slotted, child.tagName)
    if (!this.slots.includes(slotted)) {
      // console.log(this.tagName, 'childAdded', 'ADDING TO SLOTS', slotted, this.slots)

      this.slots.push(slotted)
    }
    this.childrenBySlot.set(slotted, child)
  }

  private childRemoved(child: Element) { 
    const { childrenBySlot } = this
    const slotted = child.getAttribute('slotted')
    
    if (!(slotted && childrenBySlot.has(slotted))) return

    // console.log(this.tagName, 'childRemoved', slotted, child.tagName)
    this.childrenBySlot.delete(slotted)
   
  }

  private get childElements(): Element[] {
    return Array.from(this.childrenBySlot.values())
  }

  private get childSlotteds(): Slotted[] {
    return this.childElements.filter<Slotted>((child): child is Slotted => 
      child instanceof Slotted
    )
  }

  private get childComponents(): Component[] {
    return this.childElements.filter<Component>((child): child is Component => 
      child instanceof Component
    )
  }


  protected childrenBySlot = new Map<string, Element>()

  protected connectionHandler(event: ConnectionEvent) {
    const { target } = event
    // console.log(this.tagName, 'connectionHandler', (target! as Element).tagName)
    if (target instanceof Element) {
      const { detail } = event
      const { connected, handled } = detail
      if (!handled) {
        if (connected) this.childAdded(target)
        else this.childRemoved(target)
        detail.handled = true
        // event.stopPropagation()
      }
      this.requestUpdate('exportParts')
    } else {
      // console.log(this.tagName, 'connectionHandler NOT SLOTTED')
    }
  }

  protected override get defaultContent(): Content | void { 
    const rendereds: Contents = []
    const { slots: mySlots, slotsAndPaths: detail, } = this
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
          @slotchange='${this.slotChangeHandler}'
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

  protected defaultSlottedContent(slot: string, slots: Htmls): Content | void { 
    return html`${slot}${slots}`
  }

  @property({ reflect: true, type: String })
  get exportParts(): string | undefined {
    const { slotted: mySlot } = this
    if (!mySlot) return undefined

    const { childSlotteds } = this
    if (!childSlotteds.length) return undefined

    const childrenExports = childSlotteds.flatMap(child => {
      const { exportParts, slotted: childSlot } = child 
      const exported = [[childSlot, [mySlot, childSlot].join('-')].join(':')]
      if (exportParts) {
        const reexported = exportParts.split(',').map(exportPart => {
          const [_childPart, childExportedPart] = exportPart.split(':')
          const exportedAs = [mySlot, childExportedPart].join('-')
          return [childExportedPart, exportedAs].join(':')
        })
        exported.push(...reexported)
      }
      return exported
    })
    return childrenExports.join(',') 
  }

  override async getUpdateComplete(): Promise<boolean> {
    // console.debug(this.tagName, 'getUpdateComplete')
    return super.getUpdateComplete().then(complete => {
// return true
      if (!complete) return false

      const { childComponents } = this

      if (!childComponents.length) {
        // console.log(this.tagName, 'getUpdateComplete NO childrenBySlot')
        return true
      }
      
      const promises = childComponents.map(child => child.updateComplete)
      // console.debug(this.tagName, this.slotted, 'getUpdateComplete...', promises.length)
      return Promise.all(promises).then(results => {
        const completed = results.every(Boolean)
        console.debug(this.tagName, 'getUpdateComplete!', completed, Importer.importFinished, results.length)
        return completed && Importer.importFinished
      })
    })
  }

  private get slotsAndPaths(): SlottedEventDetail {
    const detail: SlottedEventDetail = { 
      slots: [], paths: new Set<string>() 
    }
    const init: CustomEventInit<SlottedEventDetail> = { 
      detail, composed: true, bubbles: false, cancelable: true
    }
    const event = new CustomEvent<SlottedEventDetail>('slotted', init)
    this.dispatchEvent(event)
    this.slottedHandler(event)
    return detail
  }
  @eventOptions({ capture: true })
  private slotChangeHandler() { 
    // console.debug(this.tagName, 'onSlotChanged')
    this.importElements(this.assignedElements) 
  }

  protected slottedHandler(event: SlottedEvent) {
    const { detail } = event 
    const { slots, paths } = detail
    const { slotted } = this
    if (slotted) slots.push(slotted)
    this.slotsAssignedInChildren.forEach(slot => {
      const key = [...slots, slot].join('-')  
      paths.add(key)
    })
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

  @property()
  slotted = ''

  protected slots: string[] = []

  override connectedCallback() {
   const { parentElement, slots } = this
    if (parentElement && parentElement.isConnected && !parentElement.tagName.toLowerCase().startsWith('movie-masher')) {
      // console.log(this.tagName, 'connectedCallback', this.slotted, this.slots, parentElement.tagName)
      this.dispatchConnection(true)
    }
    else console.debug(this.constructor.name, 'connectedCallback without slots', slots.length, parentElement?.tagName)
    super.connectedCallback()
  }  
  
  override disconnectedCallback() {
    const { parentElement, slots } = this
    if (slots.length, parentElement && parentElement.isConnected) {
      this.dispatchConnection(false)
    }
    super.disconnectedCallback()
  }

  protected dispatchConnection(connected: boolean) {
    const detail = { connected, handled: false }
    const init: CustomEventInit<ConnectionEventDetail> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    const event = new CustomEvent<ConnectionEventDetail>('connection', init)
    this.dispatchEvent(event)
  }
}
