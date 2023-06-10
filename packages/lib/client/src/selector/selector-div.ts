import type { Content, Contents, Htmls, MovieMasherContext, OptionalContent } from '../declarations.js'

import { css, html } from 'lit'
// import { property } from 'lit/decorators/property.js'
import { customElement } from 'lit/decorators/custom-element.js'
import { consume } from '@lit-labs/context'

import { movieMasherContext } from '../movie-masher-context.js'
import { Div, LeftCenterRight } from '../Base/LeftCenterRight.js'
import { Component } from '../Base/Component.js'


@customElement('movie-masher-selector-div')
export class SelectorDivElement extends Div {
  @consume({ context: movieMasherContext, subscribe: true })
  // @property({ attribute: false })
  masherContext: MovieMasherContext | undefined

  override centerContent(slots: Htmls): OptionalContent {
    const slotsCopy = [...slots]
    const { masherContext } = this
    if (masherContext) {
      const { assetObjects } = masherContext
      if (assetObjects.length) {
        this.importTags('movie-masher-selector-span')
        slotsCopy.push(...assetObjects.map(assetObject => {
          const { id } = assetObject
          console.log(this.tagName, 'centerContent', id)
          return html`<movie-masher-selector-span 
            media-id='${id}'
          ></movie-masher-selector-span>`
        }))
      }   
    } else slotsCopy.push(html`<h1>NO MASHER CONTEXT</h1>`)
    return html`<span class='center'>${slotsCopy}</span>`
  }


  protected override content(contents: Contents): Content { 
    return html`<div>${contents}</div>` 
  }


  static override styles = [
    Component.cssHostFlex,
    Component.cssDivFlex,
    LeftCenterRight.cssHostOverflowY,
    css`
      div > span {
        flex-grow: 1;
        padding: var(--padding);
        display: grid;
        grid-template-columns: repeat(auto-fit, calc(var(--viewer-width) * var(--icon-ratio)));
        grid-auto-rows: calc(var(--viewer-height) * var(--icon-ratio));
        gap: var(--spacing);
        overflow-y: auto;
      }

      div > span > *:hover,
      div > span > *.selected {
        border-color: var(--item-fore-selected);
        color: var(--item-fore-selected);
        background-color: var(--item-back-selected);
      }

      div > span > *.selected:hover {
        border-color: var(--item-fore-hover);
        color: var(--item-fore-hover);
        background-color: var(--item-back-hover);
      }    
      div > span .dropping {
        box-shadow: var(--dropping-shadow);
      }
    `
  ]
}


