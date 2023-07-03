import type { 
  Htmls, Content, Contents, ConnectionEventDetail 
} from '../declarations'

import { html } from 'lit-html/lit-html.js'
import { ifDefined } from 'lit-html/directives/if-defined.js'

import { ImporterComponent } from './ImporterComponent'
import { Component } from './Component'
// import { Component } from './Component'

export type SlottedEvent = CustomEvent<SlottedEventDetail>

export interface SlottedEventDetail {
  slots: string[]
  paths: Set<string>
}

export class Slotted extends ImporterComponent {
  constructor() {
    super()
    this.slotted = ''
  }

  protected childrenBySlot = new Map<string, Element>()

  override connectedCallback() {
    const { parentElement, slots } = this
    if (parentElement && parentElement.isConnected && !parentElement.tagName.toLowerCase().startsWith('movie-masher')) {
      // console.log(this.tagName, 'connectedCallback', this.slotted, this.slots, parentElement.tagName)
      this.dispatchConnection(true)
    }
    else console.debug(this.constructor.name, 'connectedCallback without slots', slots.length, parentElement?.tagName)
    super.connectedCallback()
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
          @slotchange='${this.slotChangeHandler}'
          name='${name}' 
          slot='${ifDefined(passed)}' 
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


  // override async getUpdateComplete(): Promise<boolean> {
  //   // console.debug(this.tagName, 'getUpdateComplete')
  //   return super.getUpdateComplete().then(complete => {
  //     // return true
  //     if (!complete) return false

  //     const { childComponents } = this

  //     if (!childComponents.length) {
  //       // console.log(this.tagName, 'getUpdateComplete NO childrenBySlot')
  //       return true
  //     }
      
  //     const promises = childComponents.map(child => child.updateComplete)
  //     // console.debug(this.tagName, this.slotted, 'getUpdateComplete...', promises.length)
  //     return Promise.all(promises).then(results => {
  //       const completed = results.every(Boolean)
  //       console.debug(this.tagName, 'getUpdateComplete!', completed, ImporterComponent.importFinished, results.length)
  //       return completed && ImporterComponent.importFinished
  //     })
  //   })
  // }

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

  private slotChangeHandler(event: Event) { 
    const { target } = event
    if (!(target instanceof HTMLSlotElement)) return
    const { children } = target
    console.debug(this.tagName, 'onSlotChanged', children.length)
    this.importElements(Array.from(children))
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

  declare slotted?: string

  protected slots: string[] = []

  static override properties = {
    ...Component.properties,
    slotted: { type: String },
  }
}
