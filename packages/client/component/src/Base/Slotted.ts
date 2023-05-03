import type { 
  Htmls, Content, Contents, ConnectionEvent 
} from '../declarations'

import { html } from 'lit'
import { queryAssignedElements } from 'lit/decorators/query-assigned-elements.js'
import { eventOptions } from 'lit/decorators/event-options.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { property } from 'lit/decorators/property.js'

import { Importer } from './Importer'

type SlottedEvent = CustomEvent<SlottedEventDetail>

interface SlottedEventDetail {
  slots: string[]
  paths: Set<string>
}

export class Slotted extends Importer {
  @queryAssignedElements()
  protected assignedElements!: Array<HTMLElement>

  private childAdded(child: Slotted) {
    const { childrenBySlot } = this
    const { slotted } = child
    if (!slotted || childrenBySlot.has(slotted)) return

    // console.log(this.tagName, 'childAdded', slotted, child.tagName)
    this.childrenBySlot.set(slotted, child)
  }

  private childRemoved(child: Slotted) { 
    const { childrenBySlot } = this
    const { slotted } = child
    if (!(slotted && childrenBySlot.has(slotted))) return

    // console.log(this.tagName, 'childRemoved', slotted, child.tagName)
    this.childrenBySlot.delete(slotted)
   
  }

  protected childrenBySlot = new Map<string, Slotted>()

  protected connectionHandler(event: ConnectionEvent) {
    const { target } = event
    if (target instanceof Slotted) {
      if (event.detail) this.childAdded(target)
      else this.childRemoved(target)
      this.requestUpdate('exportParts')
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
    const { childrenBySlot, slotted: mySlot } = this
    if (!(mySlot && childrenBySlot.size)) return undefined

    const children = Array.from(childrenBySlot.values())
    const childrenExports = children.flatMap(child => {
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

      if (!complete) return false
      if (!this.childrenBySlot.size) return true
      
      const promises = Array.from(this.childrenBySlot.values()).map(child => 
        child.updateComplete
      )
      // console.debug(this.tagName, this.slotted, 'getUpdateComplete...', promises.length)
      return Promise.all(promises).then(results => {
        const completed = results.every(Boolean)
        // console.debug(this.tagName, 'getUpdateComplete!', completed, Importer.importFinished)
        
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
    if (slots.length && parentElement && parentElement.isConnected) {
      this.dispatchConnection(true)
    }
    // else console.debug(this.constructor.name, 'connectedCallback without parentElement or parentElement.isConnected', parentElement, parentElement?.isConnected)
    super.connectedCallback()
  }  
  
  override disconnectedCallback() {
    const { parentElement, slots } = this
    if (slots.length, parentElement && parentElement.isConnected) {
      this.dispatchConnection(false)
    }
    super.disconnectedCallback()
  }

  protected dispatchConnection(detail: boolean) {
    const init: CustomEventInit<boolean> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    const event = new CustomEvent<boolean>('connection', init)
    this.dispatchEvent(event)
  }
}


