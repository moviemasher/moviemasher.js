import type { 
  Htmls, Nodes, Content, Contents, SlottedContent, ConnectionEvent, Elements 
} from '../declarations'


import { html, nothing } from 'lit'
import { queryAssignedElements } from 'lit/decorators/query-assigned-elements.js'
import { eventOptions } from 'lit/decorators/event-options.js'
import { ifDefined } from 'lit/directives/if-defined.js'
// import { MutationController } from '@lit-labs/observers/mutation-controller.js'


import { Importer } from './Importer'
import { Base } from './Base'

type SlottedEvent = CustomEvent<SlottedEventDetail>
interface SlottedEventDetail {
  slots: string[]
  paths: Set<string>
}

export class Slotted extends Importer {
  // protected _observer = new MutationController(this, {
  //   config: { 
  //     attributes: false, characterData: true,
  //     childList: true, subtree: true, 
  //   },
  //   callback: (mutations, _observer) => {

  //     console.debug(this.tagName, 'mutation', ...mutations)
  //     // this.requestUpdate()
  //   },
  //   skipInitial: true,
  // })


  @queryAssignedElements()
  protected assignedElements!: Array<HTMLElement>

  private defaultOrSlottedContent(): SlottedContent { 
    // console.debug(this.tagName, 'defaultOrSlottedContent')
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
  protected childrenBySlot = new Set<Base>()

  protected override dispatchConnection(connected: boolean): boolean {
    const dispatched = super.dispatchConnection(connected)
    
    
    if (dispatched) {
      this.importElements(Array.from(this.children))
      // console.debug(this.tagName, 'dispatchConnection', this.childElementCount)
    }
    return dispatched
  }
  protected exportsForSlot(slot: string) {
    const mapped = this.exportsBySlot.get(slot)
    if (!mapped?.length) return undefined

    return mapped.join(',')
  }

  override async getUpdateComplete(): Promise<boolean> {
    // console.debug(this.tagName, 'getUpdateComplete')
    return super.getUpdateComplete().then(complete => {

      if (!complete) return false
      if (!this.childrenBySlot.size) return true
      
      const promises = Array.from(this.childrenBySlot).map(child => 
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

  protected override importElements(elements: Elements): void {
    // console.log(this.tagName, 'importElements', elements.length, this.innerHTML)
    super.importElements(elements)
    elements.forEach(element => {
      if (element instanceof Base) {
        const { slotted } = element
        if (slotted) this.childrenBySlot.add(element)
        // console.log('importElements ADDING', element.tagName, 'to', this.tagName)
      } 
      //else console.log(this.tagName, 'importElements NOT', element.tagName)

    })
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

  protected onConnection(event: ConnectionEvent) {
    const { exportsBySlot, slots: mySlots } = this
    
    const { detail, target } = event
    const { slots, connected, slotted } = detail
    
    if (target instanceof Base) {
      if (connected) {          
        // console.debug(this.tagName, 'onConnection connect!', slotted)

        if (mySlots.includes(slotted)) {
          const mapped = slots.map(exportToken => {
            const rexportedAs = [slotted, exportToken].join('-')
            return [exportToken, rexportedAs].join(':')
          })
          exportsBySlot.set(slotted, mapped)
        
            // console.debug('CONNECT', target.tagName, '@', slotted, this.tagName)
            this.childrenBySlot.add(target)
            // console.log('onConnection ADDING', target.tagName, 'to', this.tagName)

        }// else console.debug(this.tagName, 'onConnection connect', slotted, 'NOT IN', mySlots)

      }
      else {
        // console.debug('DISCONNECT', '@', slotted, this.tagName)

        // console.debug(this.tagName, 'onConnection disconnect', slotted, target?.tagName)
        exportsBySlot.delete(slotted)    
        console.log('onConnection DELETING', target.tagName, 'from', this.tagName)
        // this.childrenBySlot.delete(target)    
      }
    } //else console.debug(this.tagName, 'onConnection connect', slotted, 'NOT BASE')

    // this.requestUpdate()
    if (this.slotted && this.slots.length) {
      detail.slotted = this.slotted
      detail.slots = [
        ...this.slots,
        ...this.slots.flatMap(slot => (
          exportsBySlot.get(slot) || []).map(s => String(s.split(':').pop())
        ))
      ]
    } else event.stopPropagation()
  }

  @eventOptions({ capture: true })
  private onSlotChanged() { 
    console.debug(this.tagName, 'onSlotChanged')
    this.importElements(this.assignedElements) 
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

  private get renderContents(): Contents{
    const { unslottedNodes } = this
    const rendereds: Contents = [] 
    if (unslottedNodes.length) rendereds.push(...unslottedNodes)
    else {
      const defaultContent = this.defaultOrSlottedContent()
      if (defaultContent) rendereds.push(defaultContent)
    }  
    return rendereds
  }

  private get unslottedNodes(): Nodes {
    const { childNodes } = this
    const looseNodes: Nodes = Array.from(childNodes).filter(node => {
      if (node instanceof Text) return node.textContent?.trim()
      if (node instanceof Element) return !node.slot
      return false
    })
    return looseNodes
  }

  override render() {
    // console.debug(this.tagName, 'render')

    const { renderContents: rendereds } = this
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

  slottedContent(contents: Contents): Content { 
    console.warn(this.tagName, 'slottedContent NOT OVERRIDDEN')
    return html`${contents}` 
  }

}


