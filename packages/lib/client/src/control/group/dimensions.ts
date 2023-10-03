import type { BooleanRecord, PropertyIds, Strings } from '@moviemasher/runtime-shared'
import type { PropertyDeclarations } from 'lit'
import type { CSSResultGroup } from 'lit-element/lit-element.js'
import type { Contents, ControlGroup, OptionalContent } from '../../declarations.js'

import { AspectFlip, DOT } from '@moviemasher/lib-shared'
import { EventControlGroup, MovieMasher, StringEvent } from '@moviemasher/runtime-client'
import { ASPECT, END, SIZE_KEYS, } from '@moviemasher/runtime-shared'
import { html } from 'lit-html/lit-html.js'
import { Component } from '../../Base/Component.js'
import { ControlGroupMixin, ControlGroupProperties, ControlGroupStyles } from '../../Base/ControlGroupMixin.js'
import { ImporterComponent } from '../../Base/ImporterComponent.js'
import { SizeReactiveMixin } from '../../Base/SizeReactiveMixin.js'

const DimenstionsControlGroupElementName = 'movie-masher-control-group-dimensions'

const WithControlGroup = ControlGroupMixin(ImporterComponent)
const WithSizeReactive = SizeReactiveMixin(WithControlGroup)
export class DimenstionsControlGroupElement extends WithSizeReactive implements ControlGroup {
  override connectedCallback(): void {
    const heightId = this.namePropertyId(`height${END}`)
    if (heightId) {
      const [target] = heightId.split(DOT)
      const key = `control-group-${target}-height`
      this.listeners[key] = this.handleHeight.bind(this)
    }

    const widthId = this.namePropertyId(`width${END}`)
    if (widthId) {
      const [target] = widthId.split(DOT)
      const key = `control-group-${target}-width`
      this.listeners[key] = this.handleWidth.bind(this)
    }
    super.connectedCallback()
  }

  protected override get defaultContent(): OptionalContent {
    const { propertyIds, size } = this
    if (!(size && propertyIds?.length)) return


    const aspectFlip = this.propertyIdValue(`size${ASPECT}`) === AspectFlip
    const portrait = size.height > size.width
    const aspectIcon = portrait ? 'landscape' : 'portrait' 

    this.importTags('movie-masher-component-icon')
    return html`
      <fieldset>
        <legend>
          <movie-masher-component-icon icon='size'></movie-masher-component-icon>
        </legend>
        ${this.propertyNameContent('lock')}
        ${this.dimensionsContent(aspectFlip, portrait)}
        ${this.controlContent(`size${ASPECT}`, aspectIcon)}
      </fieldset>
    `
  }

  private dimensionsContent(aspectFlip: boolean, portrait: boolean): Contents {
    const contents: Contents = []
    const flipped = aspectFlip && portrait
    const widthIcon = flipped ? 'height' : 'width'
    const heightIcon = flipped ? 'width' : 'height'
    // const lock = this.propertyIdValue('lock')
    const use: BooleanRecord = { width: true, height: true }
    // if (lock) {
    //   switch(lock) {
    //     case LockNone: break
    //     case LockWidth: {
    //       // use.height = false
    //       break
    //     }
    //     case LockHeight: {
    //       // use.width = false
    //       break
    //     }
    //     default: {
         
    //       if (lock === LockLongest) {
    //         use[flipped ? 'height' : 'width'] = false
    //       } else use[!flipped ? 'height' : 'width'] = false
            
    //     }
    //   }
    // }
    
    if (use.width) {
      const widthContent = this.controlContent('width', widthIcon)
      if (widthContent) contents.push(widthContent)
    }
    if (use.height) {
      const heightContent = this.controlContent('height', heightIcon)
      if (heightContent) contents.push(heightContent)
    }
    return contents
  }

  protected handleHeight(event: StringEvent) {
    event.stopImmediatePropagation()
    this.addOrRemoveEnd(event.detail, 'height')
  }
 
  protected handleWidth(event: StringEvent) {
    event.stopImmediatePropagation()
    this.addOrRemoveEnd(event.detail, 'width')
  }

  static handleControlGroup(event: EventControlGroup) {
    const { detail } = event
    const { propertyIds, groupedPropertyIds } = detail
    const remainingIds = propertyIds.filter(id => 
      !groupedPropertyIds.includes(id)
    )
    const { names } = DimenstionsControlGroupElement
    const foundIds = remainingIds.filter(id => names.some(name => id.endsWith(name)))
    if (foundIds.length) {
      detail.order = 2
      detail.controlGroup = DimenstionsControlGroupElement.instance(foundIds)
      detail.groupedPropertyIds.push(...foundIds)
      event.stopImmediatePropagation()
    }
  }

  static instance(propertyIds: PropertyIds) {
    const element = document.createElement(DimenstionsControlGroupElementName)
    element.propertyIds = propertyIds
    return element
  }

  private static names: Strings = [
    ...SIZE_KEYS.flatMap(key => [key, `${key}${END}`]),
    'lock',
    `size${ASPECT}`,
  ]

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
customElements.define(DimenstionsControlGroupElementName, DimenstionsControlGroupElement)

declare global {
  interface HTMLElementTagNameMap {
    [DimenstionsControlGroupElementName]: DimenstionsControlGroupElement
  }
}

// listen for control group event
MovieMasher.eventDispatcher.addDispatchListener(
  EventControlGroup.Type, DimenstionsControlGroupElement.handleControlGroup
)
