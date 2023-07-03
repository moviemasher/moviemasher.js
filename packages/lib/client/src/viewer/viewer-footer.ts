// import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { Footer } from '../Base/LeftCenterRight.js'

export class ViewerFooterElement extends Footer {
  override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-component-a')
    htmls.push(html`<movie-masher-component-a
      icon='play' emit='toggle' detail='play'
    ></movie-masher-component-a>`)

    return super.leftContent(htmls)
  }

  protected override centerContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-viewer-slider')
    htmls.push(html`<movie-masher-viewer-slider></movie-masher-viewer-slider>`)

    return super.centerContent(htmls)
  }

  // static override styles: CSSResultGroup = [
  //   LeftCenterRight.cssSection,
  //   css`
  //     footer .time {
  //       font-size: 0.75em;
  //       text-align: right;
  //       flex-grow: 1;
  //     }
  //   `
  // ]
}

// register web component as custom element
customElements.define('movie-masher-viewer-footer', ViewerFooterElement)