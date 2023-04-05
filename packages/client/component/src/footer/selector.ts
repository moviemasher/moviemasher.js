import type { Htmls, SlottedContent } from '../declarations.js'
// import type { ClientReadParams } from '@moviemasher/client-core'

import { html } from 'lit-html'
import { ifDefined } from 'lit/directives/if-defined.js'

import { customElement } from '@lit/reactive-element/decorators/custom-element.js'
// import { consume } from '@lit-labs/context'

import { Footer } from '../Base/LeftCenterRight.js'
// import { selectorContext } from '../Context/selector.js'

@customElement('moviemasher-selector-footer')
export class SelectortFooterElement extends Footer {
  // @consume({context: selectorContext, subscribe: true })
  // context?: ClientReadParams

  override leftContent(slots: Htmls): SlottedContent {
    import((new URL('../a.js', import.meta.url)).href)
    const mediaType = '' as string//this.context?.type
    return super.leftContent([
      ...slots, 
      html`
        <moviemasher-a 
          class='${ifDefined(mediaType === 'video' ? 'selected' : undefined)}' 
          icon='video' emit='section' detail='video'
        ></moviemasher-a>
      `,
      html`
        <moviemasher-a 
          class='${ifDefined(mediaType === 'image' ? 'selected' : undefined)}' 
          icon='image' emit='section' detail='image'
          ></moviemasher-a>
      `,
      html`
        <moviemasher-a 
        class='${ifDefined(mediaType === 'audio' ? 'selected' : undefined)}' 
        icon='audio' emit='section' detail='audio'
        ></moviemasher-a>
      `,
    
      html`
        <moviemasher-a 
        class='${ifDefined(mediaType === 'font' ? 'selected' : undefined)}' 
        icon='font' emit='section' detail='font'
        ></moviemasher-a>
      `,

    ]) 
  }

  override rightContent(slots: Htmls): SlottedContent {
    return super.rightContent(slots)
    // import((new URL('../right/right.js', import.meta.url)).href)
    // return html``
  }
}
