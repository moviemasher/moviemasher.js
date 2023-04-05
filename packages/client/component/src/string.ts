import type { StringEventDetail } from './declarations.js'
import type { PropertyValues } from 'lit'
import { css } from '@lit/reactive-element/css-tag.js'
import { customElement } from '@lit/reactive-element/decorators/custom-element.js'
import { property } from '@lit/reactive-element/decorators/property.js'


import { Base } from './Base/Base.js'

@customElement('moviemasher-string')
export class StringElement extends Base {
  @property() string = 'app'


  private contentOrVoid?: Text | string | void 

  private get content () {
    return this.contentOrVoid ||= this.contentInitialize
  }
  private get contentInitialize(): Text | string | void {
    const { string } = this
    if (!string) return 

    const detail: StringEventDetail = { id: string }
    const init: CustomEventInit<StringEventDetail> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    const event = new CustomEvent<StringEventDetail>('string', init)
    this.dispatchEvent(event)

    const { string: text } = detail
    if (text) return text
    
    return string
  }

  override render() { return this.content }

  override willUpdate(changedProperties: PropertyValues<this>) {
    // console.debug(this.constructor.name, 'willUpdate', changedProperties)
    if (changedProperties.has('string')) delete this.contentOrVoid
  }

  static override styles = css`
    :host {
      display: inline;
    }
   
  `
}
