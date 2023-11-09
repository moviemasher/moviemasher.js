import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { Content, Contents, Htmls, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'
import { Component } from './Component.js'
import { Slotted } from './Slotted.js'

export const HeaderSlot = 'header'
export const FooterSlot = 'footer'
export const ContentSlot = 'content'

export class Section extends Slotted {
  protected override partContent(part: string, slots: Htmls): OptionalContent { 
    switch (part) {
      case ContentSlot: return this.contentContent(slots)
      case FooterSlot: return this.footerContent(slots)
      case HeaderSlot: return this.headerContent(slots)
    }
    return super.partContent(part, slots)
  }
  
  contentContent(_htmls: Htmls): OptionalContent {}

  footerContent(_htmls: Htmls): OptionalContent {}

  headerContent(_htmls: Htmls): OptionalContent {}
  
  icon = ''
  
  override parts = [HeaderSlot, ContentSlot, FooterSlot].join(Slotted.partSeparator)

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
      grid-template-rows: var(--height-header) 1fr var(--height-footer);
      grid-template-columns: 1fr;
      border: var(--border);
      border-color: var(--back-chrome);
      border-radius: var(--radius-border);
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

