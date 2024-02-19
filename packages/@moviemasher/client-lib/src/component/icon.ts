import type { IconResponse } from '../types.js'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit'
import type { OptionalContent } from '../client-types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { MOVIEMASHER } from '@moviemasher/shared-lib/runtime.js'
import { EventIcon } from '../utility/events.js'
import { isDefiniteError } from '@moviemasher/shared-lib/runtime.js'
import { html } from 'lit-html'
import { Component } from '../base/Component.js'
import { svgStringElement } from '../utility/svg.js'

const IconElementTimeout = 1000


export const IconTag = 'movie-masher-icon'

/**
 * @category Elements
 */
export class IconElement extends Component {
  icon = 'app'

  private iconContent?: OptionalContent   

  private _iconPromise?: Promise<IconResponse | void>
  private get iconPromise() {
    return this._iconPromise ||= this.iconPromiseInitialize
  }

  private get iconPromiseInitialize(): Promise<IconResponse | void> {
    const promise = this.iconEventPromise
    // support adding in a slot
    if (!promise) return new Promise<IconResponse | void>(resolve => {
      setTimeout(() => { resolve(this.iconPromiseInitialize) }, IconElementTimeout)
    })
    return promise.then(orError => {
      if (isDefiniteError(orError)) {
        console.log(this.tagName, 'iconPromiseInitialize ERROR', orError.error)
        return 
      }
      const { data: icon } = orError
      const { imageElement, imgUrl, string, svgElement, svgString } = icon
      if (string) {
        this.iconContent = string
      } else if (imgUrl) this.iconContent =  html`<img src='${imgUrl}' />`
      else {
        const svgOrImage = svgElement || imageElement
        const element = svgOrImage || (svgString && svgStringElement(svgString))
        if (element) {
          element.setAttribute('part', 'element')
          this.iconContent = element
        } else this.icon = ''
      } 
      this.requestUpdate() 
    })
  }

  private get iconEventPromise() {
    const { icon } = this
    const event = new EventIcon(icon) 
    MOVIEMASHER.dispatch(event)
    return event.detail.promise
  }

  protected override get defaultContent(): OptionalContent {
    const { iconContent, icon } = this
    if (iconContent) return iconContent 
    
    if (icon) this.iconPromise
    return html`<div></div>`
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('icon') && changedProperties.get('icon')) {
      // console.debug(this.constructor.name, 'willUpdate', changedProperties)
      delete this.iconContent
      delete this._iconPromise
    }
  }

  static override properties: PropertyDeclarations = {
    icon: { type: String }
  }

  static override styles: CSSResultGroup = [
    css`
      :host {
        display: inline-block;
        height: 1em;
        min-width: 1em;
      }
      svg, img, div {
        height: 1em;
        aspect-ratio: 1/1;
      }
    `
  ]
}

customElements.define(IconTag, IconElement)

declare global {
  interface HTMLElementTagNameMap {
    [IconTag]: IconElement
  }
}