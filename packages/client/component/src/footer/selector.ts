import type { Htmls, SlottedContent } from '../declarations.js'
import type { ClientReadParams } from '@moviemasher/client-core'

import { consume } from '@lit-labs/context'
import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'

import { Footer } from '../Base/LeftCenterRight.js'
import { clientReadParamsContext } from '../Context/clientReadParamsContext.js'

@customElement('moviemasher-selector-footer')
export class SelectortFooterElement extends Footer {
  @consume({ context: clientReadParamsContext, subscribe: true })
  @property({ attribute: false })
  clientReadParams?: ClientReadParams

  override leftContent(slots: Htmls): SlottedContent {

    this.importTags('moviemasher-a')
    
    const mediaType = this.clientReadParams?.type || 'video'
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
  }
}
