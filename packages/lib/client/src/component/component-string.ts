import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit'

import { css } from '@lit/reactive-element/css-tag.js'
import { EventTranslate, MOVIEMASHER } from '@moviemasher/runtime-client'
import { isDefiniteError } from '@moviemasher/runtime-shared'
import { OptionalContent } from '../Types.js'
import { Component } from '../base/Component.js'

const StringElementTimeout = 1000

const StringTag = 'movie-masher-component-string'

/**
 * @category Component
 */
export class StringElement extends Component {
  private stringContent?: OptionalContent   

  private _stringPromise?: Promise<string | void>
  private get stringPromise() {
    return this._stringPromise ||= this.stringPromiseInitialize
  }

  private get stringPromiseInitialize(): Promise<string | void> {
    const promise = this.stringEventPromise
    // support adding in a slot
    if (!promise) return new Promise<string | void>(resolve => {
      setTimeout(() => { resolve(this.stringPromiseInitialize) }, StringElementTimeout)
    })
    return promise.then(orError => {
      const string = isDefiniteError(orError) ? this.string : orError.data
      this.stringContent = string 
      this.requestUpdate()
    })
  }
  private get stringEventPromise() {
    const { string } = this
    const event = new EventTranslate(string) 
    MOVIEMASHER.eventDispatcher.dispatch(event)
    return event.detail.promise
  }

  protected override get defaultContent(): OptionalContent {
    const { stringContent, string } = this
    if (stringContent) return stringContent 
    
    if (string) this.stringPromise
    return ''
  }

  string = ''

  override willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('string') && changedProperties.get('string')) {
      // console.debug(this.constructor.name, 'willUpdate', changedProperties)
      delete this.stringContent
      delete this._stringPromise
    }
  }

  static override properties: PropertyDeclarations = {
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

customElements.define(StringTag, StringElement)

declare global {
  interface HTMLElementTagNameMap {
    [StringTag]: StringElement
  }
}
