import type { Icon } from '@moviemasher/runtime-client'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit'
import type { OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { EventIcon, MovieMasher } from '@moviemasher/runtime-client'
import { isDefiniteError } from '@moviemasher/runtime-shared'
import { html } from 'lit-html/lit-html.js'
import { Component } from '../Base/Component.js'

const IconElementTimeout = 1000

export class IconElement extends Component {
  icon = 'app'

  private iconContent?: OptionalContent   

  private _iconPromise?: Promise<Icon | void>
  private get iconPromise() {
    return this._iconPromise ||= this.iconPromiseInitialize
  }

  private get iconPromiseInitialize(): Promise<Icon | void> {
    const promise = this.iconEventPromise
    if (!promise) {
      console.log(this.tagName, 'iconPromiseInitialize NO PROMISE')
      return new Promise<Icon | void>(resolve => {
        setTimeout(() => { resolve(this.iconPromiseInitialize) }, IconElementTimeout)
      })
    }

    return promise.then(orError => {
      if (isDefiniteError(orError)) {
        console.log(this.tagName, 'iconPromiseInitialize ERROR', orError.error)
        return 
      }

      const { data: icon } = orError
      const { imageElement, imgUrl, string, svgElement, svgString } = icon
      if (string) {
        console.log(this.constructor.name, 'iconPromiseInitialize STRING', string)
        this.iconContent = string
      } else if (imgUrl) this.iconContent =  html`<img src='${imgUrl}' />`
      else {
        const svgOrImage = svgElement || imageElement
        const element = svgOrImage || (svgString && IconElement.svgStringElement(svgString))
        if (element) {
          element.setAttribute('part', 'element')
          this.iconContent = element
        } else {
          this.icon = ''
          console.warn(this.constructor.name, 'iconPromiseInitialize with no icon', this.icon)
        }
      } 
      return icon
    })
  }

  private get iconEventPromise() {
    const { icon } = this
    const event = new EventIcon(icon) 
    MovieMasher.eventDispatcher.dispatch(event)
    return event.detail.promise
  }

  protected override get defaultContent(): OptionalContent {
    const { iconContent, icon } = this
    if (!iconContent) {
      if (icon) this.iconPromise.then(iconOrVoid => { 
        // console.log(this.constructor.name, this.icon, 'render', !!this.content)
        if (iconOrVoid) this.requestUpdate() 
      })
      return html`<div></div>`
    }
    return iconContent 
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('icon') && changedProperties.get('icon')) {
      // console.debug(this.constructor.name, 'willUpdate', changedProperties)
      delete this.iconContent
      delete this._iconPromise
    }
  }
  static override properties: PropertyDeclarations = {
    // ...Component.properties,
    icon: { type: String }
  }

  static override styles: CSSResultGroup = [
    
        // vertical-align: middle;
    css`
      :host {
        --color: inherit;
        color: var(--color);
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
    // extract just the SVG tag
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

// register web component as custom element
customElements.define('movie-masher-component-icon', IconElement)