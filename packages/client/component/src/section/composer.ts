import type { Htmls, SlottedContent } from '../declarations.js'

import { ifDefined } from 'lit/directives/if-defined.js'

import { customElement } from 'lit/decorators/custom-element.js'
import { css } from 'lit'
import { html } from 'lit'

import { Section } from '../Base/Section.js'

@customElement('moviemasher-composer-section')
export class ComposerSectionElement extends Section {
 
  override divContent(htmls: Htmls): SlottedContent {
    this.importTags('moviemasher-composer-div')
    return html`<moviemasher-composer-div
      exportparts='${ifDefined(this.exportsForSlot('div'))}'
      part='div' slotted='div'
    >${htmls}</moviemasher-composer-div>`
  }
    
  override footerContent(htmls: Htmls): SlottedContent {
    this.importTags('moviemasher-composer-footer')
    return html`<moviemasher-composer-footer
      exportparts='${ifDefined(this.exportsForSlot('footer'))}'
      part='footer' slotted='footer'
    >${htmls}</moviemasher-composer-footer>`
  }

  override headerContent(htmls: Htmls): SlottedContent {
    this.importTags('moviemasher-composer-header')
    return html`<moviemasher-composer-header
      exportparts='${ifDefined(this.exportsForSlot('header'))}'
      part='header' slotted='header'
      icon='${this.icon}' 
    >${htmls}</moviemasher-composer-header>`
  }

  static override styles = [
    ...Section.styles, 
    css`
      :host {
        grid-area: compose;
      }
    `
  ]

}
