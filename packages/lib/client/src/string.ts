import type { TranslationEventDetail } from './declarations.js'
import type { PropertyValues } from 'lit'
import { css } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'


import { Component } from './Base/Component.js'

@customElement('movie-masher-string')
export class StringElement extends Component {
  @property() string = 'app'


  private contentOrVoid?: Text | string | void 

  private get stringContent () {
    return this.contentOrVoid ||= this.contentInitialize
  }
  private get contentInitialize(): Text | string | void {
    const { string } = this
    if (!string) return 

    const detail: TranslationEventDetail = { id: string }
    const init: CustomEventInit<TranslationEventDetail> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    const event = new CustomEvent<TranslationEventDetail>('string', init)
    this.dispatchEvent(event)

    const { id: text } = detail
    if (text) return text
    
    return string
  }

  override render() { return this.stringContent }

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
