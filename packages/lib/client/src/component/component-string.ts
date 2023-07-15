import type { CSSResultGroup, PropertyValues } from 'lit'
import type { TranslationEventDetail } from '@moviemasher/runtime-client'
import { css } from '@lit/reactive-element/css-tag.js'

import { Component } from '../Base/Component.js'
import { MovieMasher } from '@moviemasher/runtime-client'

export class StringElement extends Component {
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
    MovieMasher.eventDispatcher.dispatch(event)

    const { id: text } = detail
    if (text) return text
    
    return string
  }

  override render() { return this.stringContent }

  string = 'app'

  override willUpdate(changedProperties: PropertyValues<this>) {
    // console.debug(this.constructor.name, 'willUpdate', changedProperties)
    if (changedProperties.has('string')) delete this.contentOrVoid
  }

  static override properties = {
    ...Component.properties,
    string: { type: String }
  }

  static override styles: CSSResultGroup = [
    css`
      :host {
        display: inline;
      }
    
    `
  ]
}

// register web component as custom element
customElements.define('movie-masher-component-string', StringElement)