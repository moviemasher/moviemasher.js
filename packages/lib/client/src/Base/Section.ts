import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { Content, Contents, Htmls, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'
import { Component } from './Component.js'
import { Slotted } from './Slotted.js'

export const HeaderSlot = 'header'
export const FooterSlot = 'footer'
export const DivSlot = 'div'

export class Section extends Slotted {
  protected override partContent(part: string, slots: Htmls): OptionalContent { 
    switch (part) {
      case DivSlot: return this.divContent(slots)
      case FooterSlot: return this.footerContent(slots)
      case HeaderSlot: return this.headerContent(slots)
    }
    return super.partContent(part, slots)
  }
  
  divContent(_htmls: Htmls): OptionalContent { return '[DIV]' }

  footerContent(_htmls: Htmls): OptionalContent { return '[FOOTER]' }

  headerContent(_htmls: Htmls): OptionalContent { return '[HEADER]' }
  
  icon = 'app'
  
  override parts = [HeaderSlot, DivSlot, FooterSlot].join(Slotted.partSeparator)

  protected override content(contents: Contents): Content {
    return html`<section
      @export-parts='${this.handleExportParts}'
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

  static override properties: PropertyDeclarations = {
    ...Slotted.properties,
    icon: { type: String }
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    this.styleHost,
    this.styleSection,
  ]
}

