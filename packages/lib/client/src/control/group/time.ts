import type { PropertyDeclarations } from 'lit'
import type { CSSResultGroup } from 'lit-element/lit-element.js'
import type { Contents, ControlGroup, OptionalContent } from '../../declarations.js'

import { html } from 'lit-html/lit-html.js'

import { EventControlGroup } from '@moviemasher/runtime-client'
import { PropertyIds, Strings } from '@moviemasher/runtime-shared'

import { Component } from '../../Base/Component.js'
import { ControlGroupMixin, ControlGroupProperties, ControlGroupStyles } from '../../Base/ControlGroupMixin.js'
import { ImporterComponent } from '../../Base/ImporterComponent.js'
import { DOT } from '@moviemasher/lib-shared'


const TimeControlGroupTag = 'movie-masher-control-group-time'

const WithControlGroup = ControlGroupMixin(ImporterComponent)
export class TimeControlGroupElement extends WithControlGroup implements ControlGroup {
  private get framedContent(): OptionalContent {
    const htmls: Contents = []
    const frameId = this.namePropertyId('frame')
    const framesId = this.namePropertyId('frames')
    const frameInput = this.controlInputContent(frameId)
    if (frameInput) htmls.push(html`
      <movie-masher-component-icon icon='frame'></movie-masher-component-icon>
      ${frameInput}
    `)
    const framesInput = this.controlInputContent(framesId)
    if (framesInput) htmls.push(html`
      <movie-masher-component-icon icon='frames'></movie-masher-component-icon>
      ${framesInput}
    `)
    if (!htmls.length) return

    return html`<div>${htmls}</div>`
  }

  protected override get defaultContent(): OptionalContent {
    const { propertyIds } = this
    if (!propertyIds?.length) return

    this.importTags('movie-masher-component-icon')
    return html`
      <fieldset>
        <legend>
          <movie-masher-component-icon icon='timeline'></movie-masher-component-icon>
        </legend>
        ${this.controlContent('timing')}
        ${this.framedContent}
      </fieldset>
    `
  }

  static handleControlGroup(event: EventControlGroup) {
    const { detail } = event
    const { propertyIds, groupedPropertyIds } = detail
    const remainingIds = propertyIds.filter(id => 
      !groupedPropertyIds.includes(id)
    )
    const { names } = TimeControlGroupElement
    const foundIds = remainingIds.filter(id => names.some(name => id.endsWith(`${DOT}${name}`)))
    if (foundIds.length) {
      // console.log('TimeControlGroupElement.handleControlGroup', propertyIds, remainingIds, foundIds, names)
      detail.controlGroup = TimeControlGroupElement.instance(foundIds)
      detail.groupedPropertyIds.push(...foundIds)
      event.stopImmediatePropagation()
    }
  }

  static instance(propertyIds: PropertyIds) {
    const element = document.createElement(TimeControlGroupTag)
    element.propertyIds = propertyIds
    return element
  }

  private static names: Strings = ['frame', 'frames', 'timing']

  static override properties: PropertyDeclarations = {
    ...ControlGroupProperties,
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    ControlGroupStyles,
  ]
}

// register web component as custom element
customElements.define(TimeControlGroupTag, TimeControlGroupElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimeControlGroupTag]: TimeControlGroupElement
  }
}

// listen for control group event
export const ClientGroupTimeListeners = () => ({
  [EventControlGroup.Type]: TimeControlGroupElement.handleControlGroup
})
