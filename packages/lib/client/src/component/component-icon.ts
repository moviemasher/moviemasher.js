import type { PropertyValues, CSSResultGroup } from 'lit'
import type { Icon } from '@moviemasher/runtime-client'
import type { OptionalContent } from '../declarations.js'
import type { IconEventDetail } from '@moviemasher/runtime-client'

import { css } from '@lit/reactive-element/css-tag.js'

import { html } from 'lit-html/lit-html.js'
import { nothing } from 'lit-html/lit-html.js'

import { isDefiniteError } from '@moviemasher/runtime-shared'
import { EventTypeIconFromId, MovieMasher } from '@moviemasher/runtime-client'

import { Component } from '../Base/Component.js'

const IconElementTimeout = 1000

export class IconElement extends Component {
  // override async getUpdateComplete(): Promise<boolean> {
  //   return super.getUpdateComplete().then(complete => {
  //     if (!complete) {
  //       console.log(this.constructor.name, this.icon, 'getUpdateComplete SUPER', complete)
  //       return false
  //     }
  //     const { iconContent: content, icon } = this
  //     console.log(this.constructor.name, 'getUpdateComplete SUPER', icon, content, complete)

  //     if (content || !icon) return true

  //     return this.iconPromise.then(() => {  
  //       console.log(this.constructor.name, this.icon, 'getUpdateComplete iconPromise', !!this.content)
  //       this.requestUpdate()
  //       return Boolean(this.content)
  //     })
  //   })
  // }

  icon = 'app'

  private iconContent?: OptionalContent   

  // protected override dispatchConnection(connected: boolean): boolean {
  //   const dispatched = super.dispatchConnection(connected)

  //   // console.debug(this.tagName, this.icon, 'dispatchConnection', connected, this.parentElement?.tagName)

  //   return dispatched
  // }

  private _iconPromise?: Promise<Icon | void>
  private get iconPromise() {
    return this._iconPromise ||= this.iconPromiseInitialize
  }

  private get iconPromiseInitialize(): Promise<Icon | void> {
    const promise = this.iconEventPromise
    if (!promise) {
      const promise = new Promise<Icon | void>(resolve => {
        setTimeout(() => { resolve(this.iconPromiseInitialize) }, IconElementTimeout)
      })
      return promise
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
        const element = svgOrImage || (svgString && this.svgStringNode(svgString))
        if (element) {
          element.setAttribute('part', 'element')
          this.iconContent = element
        } else {
          console.warn(this.constructor.name, 'contentInitialize with no content', icon)
        }
      } 
      return icon
    })
  }

  private get iconEventPromise() {
    const { icon: iconId } = this
    const detail: IconEventDetail = { id: iconId }
    const init: CustomEventInit<IconEventDetail> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    const event = new CustomEvent<IconEventDetail>(EventTypeIconFromId, init)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = detail
    return promise
  }

  override render() { 
    // console.log(this.constructor.name, this.icon, 'render', !!this.content)
    const { iconContent: content } = this
    if (!content) {
      this.iconPromise.then(icon => { 
        // console.log(this.constructor.name, this.icon, 'render', !!this.content)
        if (icon) this.requestUpdate() 
      })
      return nothing
    }
    return content 
  }

  private svgStringClean(svgString: string) {
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

  private svgStringNode(svgString: string) {
    const cleaned = this.svgStringClean(svgString)
    if (!cleaned) return

    const parser = new DOMParser()
    const document = parser.parseFromString(cleaned, 'image/svg+xml')
    const firstChild = document.children[0]
    if (!firstChild) return

    return firstChild
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('icon') && changedProperties.get('icon')) {
      // console.debug(this.constructor.name, 'willUpdate', changedProperties)
      delete this.iconContent
      delete this._iconPromise
    }
  }
  static override properties = {
    ...Component.properties,
    icon: { type: String }
  }

  static override styles: CSSResultGroup = [
    css`
      :host {
        --color: inherit;
        color: var(--color);
        display: inline-block;
        height: 1em;
        vertical-align: middle;
      }
      svg, img {
        height: 1em !important;
        aspect-ratio: 1/1 !important;
      }
    `
  ]
}

// register web component as custom element
customElements.define('movie-masher-component-icon', IconElement)