import type { IconEventDetail, SlottedContent } from './declarations.js'
import type { PropertyValues } from 'lit'
import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html'

import { customElement } from '@lit/reactive-element/decorators/custom-element.js'
import { property } from '@lit/reactive-element/decorators/property.js'



import { Base } from './Base/Base.js'

@customElement('moviemasher-icon')
export class IconElement extends Base {
  @property() icon = 'app'


  private contentOrVoid?: SlottedContent 

  private get content () {
    return this.contentOrVoid ||= this.contentInitialize
  }

  private get contentInitialize(): SlottedContent {
    const { icon } = this
    if (!icon) {
      console.debug(this.constructor.name, 'contentInitialize with no icon')
      return 
    }
    const detail: IconEventDetail = { icon }
    const init: CustomEventInit<IconEventDetail> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    const event = new CustomEvent<IconEventDetail>('icon', init)
    this.dispatchEvent(event)

    const { imageElement, imgUrl, string, svgElement, svgString } = detail
    if (string) return string

    if (imgUrl) return html`<img src='${imgUrl}' />`

    const svgOrImage = svgElement || imageElement
    const element = svgOrImage || (svgString && this.svgStringNode(svgString))
    if (element) {
      element.setAttribute('part', 'element')
      return element
    }
    console.warn(this.constructor.name, 'contentInitialize with no content')
    return
  }

  override render() { return this.content }

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
    // console.debug(this.constructor.name, 'willUpdate', changedProperties)
    if (changedProperties.has('icon')) delete this.contentOrVoid
  }

  static override styles = css`
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
}
