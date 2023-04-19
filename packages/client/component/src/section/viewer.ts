import type { Htmls, SlottedContent } from '../declarations.js'


import { customElement } from 'lit/decorators/custom-element.js'
import { css } from 'lit'
import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

// import { sectionContext, SectionContextClass } from './context.js'
// import { provide } from '@lit-labs/context'
import { Section } from '../Base/Section.js'

@customElement('moviemasher-viewer-section')
export class ViewerSectionElement extends Section {

  override divContent(htmls: Htmls): SlottedContent {
    this.importTags('moviemasher-viewer-div')
    return html`<moviemasher-viewer-div
      exportparts='${ifDefined(this.exportsForSlot('div'))}'
      part='div' slotted='div'
    >${htmls}</moviemasher-viewer-div>`
  }
    
  override footerContent(htmls: Htmls): SlottedContent {
    this.importTags('moviemasher-viewer-footer')
    return html`<moviemasher-viewer-footer
      exportparts='${ifDefined(this.exportsForSlot('footer'))}'
      part='footer' slotted='footer'
    >${htmls}</moviemasher-viewer-footer>`
  }

  override headerContent(htmls: Htmls): SlottedContent {
    this.importTags('moviemasher-viewer-header')
    return html`<moviemasher-viewer-header 
      exportparts='${ifDefined(this.exportsForSlot('header'))}'
      part='header' slotted='header'
      icon='${this.icon}' 
    >${htmls}</moviemasher-viewer-header>`
  }


  // @provide({context: sectionContext})
  // sectionContext = new SectionContextClass(this)

  static override styles = [
    ...Section.styles, 
    css`
      :host {
        grid-area: preview;
      }
    `
  ]
}
