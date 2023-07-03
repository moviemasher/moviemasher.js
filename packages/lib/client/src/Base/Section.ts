import type { CSSResultGroup } from 'lit'
import type { 
  Content, Contents, DivSectionSlot, FooterSectionSlot, HeaderSectionSlot, 
  Htmls, OptionalContent 
} from '../declarations'


import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'

import { Slotted } from './Slotted.js'

export const HeaderSlot: HeaderSectionSlot = 'header'
export const FooterSlot: FooterSectionSlot = 'footer'
export const DivSlot: DivSectionSlot = 'div'

export class Section extends Slotted {

  protected override defaultSlottedContent(key: string, htmls: Htmls): OptionalContent { 
    switch (key) {
      case DivSlot: return this.divContent(htmls)
      case FooterSlot: return this.footerContent(htmls)
      case HeaderSlot: return this.headerContent(htmls)
    }
  }
  
  divContent(_htmls: Htmls): OptionalContent { return '[DIV]' }

  footerContent(_htmls: Htmls): OptionalContent { return '[FOOTER]' }

  headerContent(_htmls: Htmls): OptionalContent { return '[HEADER]' }
  
  icon = 'app'
  

  protected override slots: string[] = [HeaderSlot, DivSlot, FooterSlot] 

  protected override content(contents: Contents): Content {
    return html`<section
      @slotted='${this.slottedHandler}'
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
    }
  `

  static override properties = {
    ...Slotted.properties,
    icon: { type: String }
  }

  static override styles: CSSResultGroup = [
    this.styleHost,
    this.styleSection,
  ]
}

