import type { Htmls, OptionalContent, StringSlot, IconSlot } from '../declarations'

import { html } from 'lit'
import { property } from 'lit/decorators/property.js'

import { Slotted } from './Slotted'

const StringSlot: StringSlot = 'string'
const IconSlot: IconSlot = 'icon'

export class IconString extends Slotted {
  @property() detail = ''
  @property() emit = ''
  @property() [StringSlot] = ''
  @property() [IconSlot] = ''

  protected clickHandler(event: PointerEvent): void {
    const { emit } = this
    if (emit) {
      event.stopPropagation()
      const { detail } = this
      // console.debug(this.constructor.name, 'dispatching', emit, detail)
      const init: CustomEventInit<string> = { cancelable: true, bubbles: true, composed: true, detail }
      this.dispatchEvent(new CustomEvent<string>(emit, init))
    }
  }

  protected override defaultSlottedContent(key: string, htmls: Htmls): OptionalContent { 
    switch (key) {
      case StringSlot: return this.stringContent(htmls)
      case IconSlot: return this.iconContent(htmls)
    }
  }

  private iconContent(_htmls: Htmls): OptionalContent { 
    const { [IconSlot]: icon } = this
    if (!icon) return 

    this.importTags('movie-masher-icon')
    return html`<movie-masher-icon 
      part='icon' slotted='icon'
      icon='${icon}'
    ></movie-masher-icon>` 
  }

  
  override slots = [IconSlot, StringSlot] 

  private stringContent(_htmls: Htmls): OptionalContent { 
    const { [StringSlot]: string } = this
    if (!string) return 

    this.importTags('movie-masher-string')
    return html`<movie-masher-string 
      part='string' slotted='string'
      string='${string}'
    ></movie-masher-string>` 
  }

}
