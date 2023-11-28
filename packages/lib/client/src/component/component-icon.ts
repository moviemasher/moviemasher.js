import type { Icon } from '@moviemasher/runtime-client'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit'
import type { OptionalContent } from '../Types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { EventIcon, MOVIEMASHER } from '@moviemasher/runtime-client'
import { isDefiniteError } from '@moviemasher/runtime-shared'
import { html } from 'lit-html'
import { Component } from '../base/Component.js'

const IconElementTimeout = 1000


const IconTag = 'movie-masher-component-icon'

/**
 * @category Component
 */
export class IconElement extends Component {
  icon = 'app'

  private iconContent?: OptionalContent   

  private _iconPromise?: Promise<Icon | void>
  private get iconPromise() {
    return this._iconPromise ||= this.iconPromiseInitialize
  }

  private get iconPromiseInitialize(): Promise<Icon | void> {
    const promise = this.iconEventPromise
    // support adding in a slot
    if (!promise) return new Promise<Icon | void>(resolve => {
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
        const element = svgOrImage || (svgString && IconElement.svgStringElement(svgString))
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
    MOVIEMASHER.eventDispatcher.dispatch(event)
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

  private static svgStringClean(svgString: string) {
    // extract just the svg tag
    const svgRegex = /<svg[^>]*>([\s\S]*?)<\/svg>/
    const svgMatch = svgString.match(svgRegex)
    let string = svgMatch ? svgMatch[0] : ''
    if (!string) return

    // remove whitespace between tags
    const whitespaceBetweenTagsRegex = />\s+</g
    string = string.replace(whitespaceBetweenTagsRegex, '><')

    // remove whitespace around equals sign
    const whitespaceAroundEqualsRegex = /\s*=\s*/g
    string = string.replace(whitespaceAroundEqualsRegex, '=')

    // replace all whitespace and newlines with single space
    const whitespaceRegex = /\s+/g
    string = string.replace(whitespaceRegex, ' ')
    
    // include version attribute unless specified
    if (!string.includes('version=')) {
      string = string.replace(/<svg/, "<svg version='1.1'")
    }

    // include namespace attribute unless specified
    if (!string.includes('xmlns=')) {
      string = string.replace(/<svg/, "<svg xmlns='http://www.w3.org/2000/svg'")
    }
    return string 
  }

  private static svgStringElement(svgString: string) {
    const cleaned = IconElement.svgStringClean(svgString)
    if (!cleaned) return

    const parser = new DOMParser()
    const document = parser.parseFromString(cleaned, 'image/svg+xml')
    const firstChild = document.children[0]
    if (!firstChild) return

    return firstChild
  }
}

customElements.define(IconTag, IconElement)

declare global {
  interface HTMLElementTagNameMap {
    [IconTag]: IconElement
  }
}