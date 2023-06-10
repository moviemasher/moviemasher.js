import type { Htmls, MovieMasherContext, OptionalContent } from '../declarations.js'

import { consume } from '@lit-labs/context'
import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { customElement } from 'lit/decorators/custom-element.js'

import { Footer } from '../Base/LeftCenterRight.js'
import { movieMasherContext } from '../movie-masher-context.js'
import { AssetType, TypeVideo } from '@moviemasher/runtime-shared'

@customElement('movie-masher-selector-footer')
export class SelectorFooterElement extends Footer {
  @consume({ context: movieMasherContext, subscribe: true })//
  declare masherContext: MovieMasherContext

  override leftContent(slots: Htmls): OptionalContent {

    this.importTags('movie-masher-a')
    const slotsCopy = [...slots]

    const {masherContext} = this
    let type: AssetType = TypeVideo 

    
    if (masherContext) type = masherContext.assetType

  

    // console.log(this.tagName, 'leftContent', type)
    slotsCopy.push(
      html`
        <movie-masher-a 
          class='${ifDefined(type === 'video' ? 'selected' : undefined)}' 
          icon='video' emit='mediatype' detail='video'
        ></movie-masher-a>
      `,
      html`
        <movie-masher-a 
          class='${ifDefined(type === 'image' ? 'selected' : undefined)}' 
          icon='image' emit='mediatype' detail='image'
          ></movie-masher-a>
      `,
      html`
        <movie-masher-a 
          class='${ifDefined(type === 'audio' ? 'selected' : undefined)}' 
          icon='audio' emit='mediatype' detail='audio'
        ></movie-masher-a>
      `,
      // html`
      //   <movie-masher-a 
      //     class='${ifDefined(type === 'mash' ? 'selected' : undefined)}' 
      //     icon='mash' emit='mediatype' detail='mash'
      //   ></movie-masher-a>
      // `,
      
      // html`
      //   <movie-masher-a 
      //   class='${ifDefined(type === 'font' ? 'selected' : undefined)}' 
      //   icon='font' emit='mediatype' detail='font'
      //   ></movie-masher-a>
      // `,
      // html`
      // <movie-masher-a 
      //   class='${ifDefined(type === 'effect' ? 'selected' : undefined)}' 
      //   icon='effect' emit='mediatype' detail='effect'
      // ></movie-masher-a>
    // `,
    )
    

    
    return super.leftContent(slotsCopy) 
  }

  override rightContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-selector-input')
    return super.rightContent([
      ...slots, 
      html`<movie-masher-selector-input 
        slotted='input'
        icon='upload' emit='import'
      ></movie-masher-selector-input>`,
    ])
  }

  
}
