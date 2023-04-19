import type { Htmls, SlottedContent } from '../declarations.js'


import { customElement } from 'lit/decorators/custom-element.js'
// import { html } from 'lit'
// import { ifDefined } from 'lit/directives/if-defined.js'

import { Header } from '../Base/LeftCenterRight.js'

@customElement('moviemasher-inspector-header')
export class InspectorHeaderElement extends Header {
  override rightContent(slots: Htmls): SlottedContent {
        return super.rightContent(slots)
    // const { sectionContext } = this
    // if (!sectionContext?.section.openable) return super.rightContent(slots)

    // const icon = sectionContext.section.open ? 'collapse' : 'collapsed'
    // import((new URL('../a.js', import.meta.url)).href)
    // return html`<moviemasher-a 
    //   exportparts='${ifDefined(this.exportsForSlot('right'))}'
    //   part='right'
    //   slotted='right'
    //   icon='${icon}'
    //   emit='toggle'
    // ></moviemasher-a>`
  }
}
