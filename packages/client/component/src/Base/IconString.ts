import type { Htmls, SlottedContent, StringSlot, IconSlot } from '../declarations'

import { Slotted } from './Slotted'

import { html } from 'lit'
import { property } from 'lit/decorators/property.js'
import { ifDefined } from 'lit/directives/if-defined.js'

const StringSlot: StringSlot = 'string'
const IconSlot: IconSlot = 'icon'

export class IconString extends Slotted {
  @property() detail = ''
  @property() emit = ''
  @property() [StringSlot] = ''
  @property() [IconSlot] = ''

  protected onClicked(event: PointerEvent): void {
    const { emit } = this
    if (emit) {
      event.stopPropagation()
      const { detail } = this
      // console.debug(this.constructor.name, 'dispatching', emit, detail)
      const init: CustomEventInit<string> = { cancelable: true, bubbles: true, composed: true, detail }
      this.dispatchEvent(new CustomEvent<string>(emit, init))
    }
  }

  protected override defaultSlottedContent(key: string, htmls: Htmls): SlottedContent { 
    switch (key) {
      case StringSlot: return this.stringContent(htmls)
      case IconSlot: return this.iconContent(htmls)
    }
  }

  private iconContent(_htmls: Htmls): SlottedContent { 
    const { [IconSlot]: icon } = this
    if (!icon) return 

    this.importTags('moviemasher-icon')
    return html`<moviemasher-icon 
      exportparts='${ifDefined(this.exportsForSlot('icon'))}'
      part='icon' slotted='icon'
      icon='${icon}'
    ></moviemasher-icon>` 
  }

  
  override slots = [IconSlot, StringSlot] 

  private stringContent(_htmls: Htmls): SlottedContent { 
    const { [StringSlot]: string } = this
    if (!string) return 

    this.importTags('moviemasher-string')
    return html`<moviemasher-string 
      exportparts='${ifDefined(this.exportsForSlot('string'))}'
      part='string' slotted='string'
      string='${string}'
    ></moviemasher-string>` 
  }
}
