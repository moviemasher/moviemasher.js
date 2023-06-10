import type { Htmls, OptionalContent } from '../declarations.js'


import { customElement } from 'lit/decorators/custom-element.js'
// import { html } from 'lit'
// import { ifDefined } from 'lit/directives/if-defined.js'

import { Header } from '../Base/LeftCenterRight.js'

@customElement('movie-masher-inspector-header')
export class InspectorHeaderElement extends Header {
  override rightContent(slots: Htmls): OptionalContent {
        return super.rightContent(slots)
    // const { sectionContext } = this
    // if (!sectionContext?.section.openable) return super.rightContent(slots)

    // const icon = sectionContext.section.open ? 'collapse' : 'collapsed'
    // import((new URL('../a.js', import.meta.url)).href)
    // return html`<movie-masher-a 
    //   part='right'
    //   slotted='right'
    //   icon='${icon}'
    //   emit='toggle'
    // ></movie-masher-a>`
  }
}
