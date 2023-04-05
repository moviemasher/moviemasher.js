import type { 
  Content, Contents, DivSectionSlot, FooterSectionSlot, HeaderSectionSlot, 
  Htmls, SlottedContent 
} from '../declarations'


import { eventOptions } from '@lit/reactive-element/decorators/event-options.js'
import { property } from '@lit/reactive-element/decorators/property.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html'

import { Slotted } from './Slotted'

export const HeaderSlot: HeaderSectionSlot = 'header'
export const FooterSlot: FooterSectionSlot = 'footer'
export const DivSlot: DivSectionSlot = 'div'

export class Section extends Slotted {

  protected override defaultSlottedContent(key: string, htmls: Htmls): SlottedContent { 
    switch (key) {
      case DivSlot: return this.divContent(htmls)
      case FooterSlot: return this.footerContent(htmls)
      case HeaderSlot: return this.headerContent(htmls)
    }
  }
  
  divContent(_htmls: Htmls): SlottedContent { return '[DIV]' }
  
  // @property() [DivSlot] = ''

  footerContent(_htmls: Htmls): SlottedContent { return '[FOOTER]' }

  // @property() [FooterSlot] = ''

  headerContent(_htmls: Htmls): SlottedContent { return '[HEADER]' }
  
  // @property() [HeaderSlot] = ''  
  
  @property() icon = 'app'
  
  private onClicked(event: Event) {
    console.warn(this.constructor.name, 'unhandled click event', event, 'from', event.target)
  }

  override slots = [HeaderSlot, DivSlot, FooterSlot] 

  @eventOptions({ capture: true })
  protected onSection(event: CustomEvent) {
    console.warn(this.constructor.name, 'unhandled section event', event, 'from', event.target)
  }

  override slottedContent(contents: Contents): Content {
    return html`<section
      @section='${this.onSection}'
      @connection='${this.onConnection}'
      @slotted='${this.onSlotted}'
      @click='${this.onClicked}'
    >${contents}</section>`
  }

  static styleHost = css`
    :host {
      flex-grow: 1;
      display: flex;
    }
  `
  static styleSection = css`

    section {
      flex-grow: 1;
      overflow: hidden;
      display: grid;
      grid-template-rows: var(--header-height) 1fr var(--footer-height);
      grid-template-columns: 1fr;
      border: var(--border);
      border-color: var(--section-back);
      border-radius: var(--border-radius);
      background-color: var(--div-back);
  }
  
  

`
  static override styles = [
    this.styleHost,
    this.styleSection,
  ]
}

