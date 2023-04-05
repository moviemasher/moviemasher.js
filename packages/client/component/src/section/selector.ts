import type { Htmls, SlottedContent } from '../declarations.js'
import type { MediaType } from '@moviemasher/lib-core'


import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html'
import { ifDefined } from 'lit/directives/if-defined.js'
import { eventOptions } from '@lit/reactive-element/decorators/event-options.js'
import { customElement } from '@lit/reactive-element/decorators/custom-element.js'
import { property } from '@lit/reactive-element/decorators/property.js'



import { provide } from '@lit-labs/context'

import { Section } from '../Base/Section.js'
import { mediaTypeContext } from '../Context/mediaType.js'
// import { ClientReadParams } from '@moviemasher/client-core'
// import { selectorContext } from '../Context/selector.js'

@customElement('moviemasher-selector-section')
export class SelectorSectionElement extends Section {

  @provide({ context: mediaTypeContext })
  @property()
  mediaType: MediaType = 'video'


  // @provide({ context: selectorContext })
  // @property()
  // context: ClientReadParams = { type: 'video' }

  override divContent(slots: Htmls): SlottedContent {
    import((new URL('../div/selector.js', import.meta.url)).href)
    return html`<moviemasher-selector-div
      exportparts='${ifDefined(this.exportsForSlot('div'))}'
      part='div' slotted='div'
    >${slots}</moviemasher-selector-div>`
  }
    
  override footerContent(slots: Htmls): SlottedContent {
    import((new URL('../footer/selector.js', import.meta.url)).href)
    return html`<moviemasher-selector-footer
      exportparts='${ifDefined(this.exportsForSlot('footer'))}'
      part='footer' slotted='footer'
    >${slots}</moviemasher-selector-footer>`
  }

  override headerContent(slots: Htmls): SlottedContent {
    import((new URL('../header/selector.js', import.meta.url)).href)
    return html`<moviemasher-selector-header
      icon='${this.icon}'
      exportparts='${ifDefined(this.exportsForSlot('header'))}'
      part='header' slotted='header'
      >${slots}</moviemasher-selector-header>`
  }

  @eventOptions({ capture: true })
  protected override onSection(event: CustomEvent<string>) {
    console.debug(this.constructor.name, 'onSection', this.mediaType)
        event.stopPropagation()
    const { detail } = event
    switch (detail) {
      case 'audio':
      case 'video':
      case 'image': {
        console.debug(this.constructor.name, 'onSection', detail)
        // this.context = { type: detail }
        break
      }
      default: {

        break
      }
    }
  }

  static override styles = [...Section.styles, css`
  
    /* media.css */
    :host {
      grid-area: media;
    }

    .panel.media footer label {
      text-align: right;
      flex-grow: 1;
    }
    .media label > svg:hover {
      color: var(--control-fore-hover);
    }

  `]
  
}
