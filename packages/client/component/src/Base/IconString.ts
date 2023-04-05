import type { Htmls, SlottedContent, StringSlot, IconSlot } from '../declarations'
import { Slotted } from './Slotted'

import { property } from '@lit/reactive-element/decorators/property.js'

import { html } from 'lit-html'
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

    import((new URL('../icon.js', import.meta.url)).href)
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
    import((new URL('../string.js', import.meta.url)).href)
    return html`<moviemasher-string 
      exportparts='${ifDefined(this.exportsForSlot('string'))}'
      part='string' slotted='string'
      string='${string}'
    ></moviemasher-string>` 
  }
}
