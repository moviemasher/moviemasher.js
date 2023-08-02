import type { CSSResultGroup } from 'lit'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'

import { Div } from '../Base/LeftCenterRight.js'
import { Htmls, OptionalContent } from '../declarations.js'
import { Scroller } from '../Base/Scroller.js'


export class ComposerDivElement extends Div {
  protected override centerContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]

    this.importTags('movie-masher-composer-content')
    htmls.push(html`
      <movie-masher-composer-content></movie-masher-composer-content>
    `)
    return html`${htmls}`
  }

  // protected override rightContent(slots: Htmls): OptionalContent {
  //   const htmls = [...slots]
  //   this.importTags('movie-masher-inspector-target')
  //   htmls.push(html`
  //     <div class='root'>
  //       <movie-masher-inspector-target 
  //         target-id='clip'
  //       ></movie-masher-inspector-target>
  //     </div>
  //   `)
  //   return super.rightContent(htmls)
  // }

  static override styles: CSSResultGroup = [
    Div.styles,
    Scroller.cssDivRoot,
    css`
     .right {
        width: var(--inspector-width);
        position: relative;
      }
      div.root {
        display: flex;
        overflow-y: auto;
      }
      movie-masher-inspector-target {
        padding: var(--inspector-padding);
      }
    `
  ]
}

// register web component as custom element
customElements.define('movie-masher-composer-div', ComposerDivElement)
