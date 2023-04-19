import type { IconEventDetail, SlottedContent } from './declarations.js'
import type { PropertyValues } from 'lit'
import type { Icon } from '@moviemasher/client-core'
import { css, nothing } from 'lit'
import { html } from 'lit'

import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'



import { Base } from './Base/Base.js'

@customElement('moviemasher-icon')
export class IconElement extends Base {
  @property() icon = 'app'

  override async getUpdateComplete(): Promise<boolean> {
    return super.getUpdateComplete().then(complete => {
      if (!complete) {
        console.debug(this.constructor.name, this.icon, 'getUpdateComplete SUPER', complete)
        return false
      }
      const { content, icon } = this
      if (content || !icon) return true

      return this.iconPromise.then(() => {  
        // console.debug(this.constructor.name, this.icon, 'getUpdateComplete iconPromise', !!this.content)
        this.requestUpdate()
        return true //Boolean(this.content)
      })
    })
  }

  private content?: SlottedContent 

  protected override dispatchConnection(connected: boolean): boolean {
    const dispatched = super.dispatchConnection(connected)

    // console.debug(this.tagName, this.icon, 'dispatchConnection', connected, this.parentElement?.tagName)

    return dispatched
  }

  private _iconPromise?: Promise<Icon>
  private get iconPromise() {
    return this._iconPromise ||= this.iconPromiseInitialize
  }
  private get iconPromiseInitialize(): Promise<Icon> {
    const { icon: iconId } = this
    const detail: IconEventDetail = { id: iconId }
    const init: CustomEventInit<IconEventDetail> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    const event = new CustomEvent<IconEventDetail>('icon', init)
    this.dispatchEvent(event)
    const { promise } = detail
    if (!promise) return Promise.resolve({}) //throw new Error('IconEvent')
    return promise.then(icon => {
      const { imageElement, imgUrl, string, svgElement, svgString } = icon
      if (string) {
        console.log(this.constructor.name, 'iconPromiseInitialize STRING', string)
        this.content = string
      } else if (imgUrl) this.content =  html`<img src='${imgUrl}' />`
      else {
        const svgOrImage = svgElement || imageElement
        const element = svgOrImage || (svgString && this.svgStringNode(svgString))
        if (element) {
          element.setAttribute('part', 'element')
          this.content = element
        } else {
          console.warn(this.constructor.name, 'contentInitialize with no content', icon)
        }
      } 
      return icon
    })
  }

  override render() { 
    // console.log(this.constructor.name, this.icon, 'render', !!this.content)
    const { content } = this
    if (!content) {
      this.iconPromise.then(() => { 
        // console.log(this.constructor.name, this.icon, 'render', !!this.content)
        this.requestUpdate() 
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
      console.debug(this.constructor.name, 'willUpdate', changedProperties)
      delete this.content
      delete this._iconPromise
    }
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
