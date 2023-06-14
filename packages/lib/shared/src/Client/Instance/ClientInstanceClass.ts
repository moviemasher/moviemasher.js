import type { Property, Scalar, ScalarRecord } from '@moviemasher/runtime-shared'
import type { ClientAsset } from "@moviemasher/runtime-client"
import type { SelectedProperties, SelectedProperty } from '@moviemasher/runtime-client'
import type { ChangePropertiesActionObject, ChangePropertyActionObject } from '../../Plugin/Masher/Actions/Action/ActionTypes.js'
import type { Actions } from "@moviemasher/runtime-client"
import type { Selectables } from '@moviemasher/runtime-client'
import type { SelectorType } from "@moviemasher/runtime-client"
import type { ClientInstance } from '../ClientTypes.js'
import type { ClientClip } from '../Mash/ClientMashTypes.js'
import type { ClientAssetManager } from '@moviemasher/runtime-client'

import { MovieMasher } from '@moviemasher/runtime-client'
import { InstanceClass } from '../../Shared/Instance/InstanceClass.js'
import { ActionTypeChange, ActionTypeChangeFrame, ActionTypeChangeMultiple, SizingContainer, SizingContent, TimingContainer, TimingContent, TimingCustom, TypeNone, isSizingMediaType, isTimingMediaType } from '../../Setup/EnumConstantsAndFunctions.js'
import { DataTypeContainerId, DataTypeContentId, DataTypeFrame } from '../../Setup/DataTypeConstants.js'
import { PropertyTweenSuffix } from '../../Base/PropertiedConstants.js'
import { assertProperty } from '../../Setup/PropertyFunctions.js'
import { assertPopulatedString } from '../../Shared/SharedGuards.js'

export class ClientInstanceClass extends InstanceClass implements ClientInstance {
  declare asset: ClientAsset
 
  get clip(): ClientClip { return super.clip as ClientClip }

  selectables(): Selectables { return [this, ...this.clip.selectables()] }

  selectType: SelectorType = TypeNone

  selectedItems(actions: Actions): SelectedProperties {
    const selectedItems: SelectedProperties = []
    const { container, clip, selectType, asset: definition } = this

    // add contentId or containerId from target, as if it were my property 
    const { id: undoValue } = definition
    const { timing, sizing, track } = clip
    const media = MovieMasher.assetManager as ClientAssetManager
    // const { media } = (track.mash as ClientMashAsset).editor

    const dataType = container ? DataTypeContainerId : DataTypeContentId
    const property = clip.properties.find(property => property.type === dataType)
    assertProperty(property)

    const { name } = property
    const undoValues: ScalarRecord = { timing, sizing, [name]: undoValue }
    const values: ScalarRecord = { ...undoValues }
    const relevantTiming = container ? TimingContainer : TimingContent
    const relevantSizing = container ? SizingContainer : SizingContent
    const timingBound = timing === relevantTiming
    const sizingBound = sizing === relevantSizing

    selectedItems.push({
      selectType, property, value: undoValue,
      changeHandler: (property: string, redoValue: Scalar) => {
        assertPopulatedString(redoValue)

        const redoValues = { ...values, [name]: redoValue }
        if (timingBound || sizingBound) {
          const newDefinition = media.fromId(redoValue)
          const { type } = newDefinition
          if (timingBound && !isTimingMediaType(type)) {
            redoValues.timing = TimingCustom
          }
          if (sizingBound && !isSizingMediaType(type)) {
            redoValues.sizing = container ? SizingContent : SizingContainer
          }
        }
        const actionObject: ChangePropertiesActionObject = {
          type: ActionTypeChangeMultiple,
          property, target: clip, redoValues, undoValues,
          redoSelection: { ...actions.selection },
          undoSelection: { ...actions.selection },
        }
        actions.create(actionObject)
      },
    })

    // add my actual properties
    const { properties } = this
    const props = properties.filter(property => this.selectedProperty(property))

    props.forEach(property => {
      selectedItems.push(...this.selectedProperties(actions, property))
    })

    return selectedItems
  }

  selectedProperties(actions: Actions, property: Property): SelectedProperties {
    const properties: SelectedProperties = []
    const { name, tweenable, type: dataType } = property

    const { selectType } = this
    const undoValue = this.value(name)
    const type = dataType === DataTypeFrame ? ActionTypeChangeFrame : ActionTypeChange
    const selectedProperty: SelectedProperty = {
      selectType, property, value: undoValue,
      changeHandler: (property: string, redoValue: Scalar) => {
        assertPopulatedString(property)
        const actionObject: ChangePropertyActionObject = {
          type, property, target: this, redoValue, undoValue,
          redoSelection: { ...actions.selection },
          undoSelection: { ...actions.selection },
        }
        actions.create(actionObject)
      }
    }
    // console.log(this.constructor.name, 'selectedProperties', name)
    properties.push(selectedProperty)
    if (tweenable) {
      const tweenName = [name, PropertyTweenSuffix].join('')
      const undoValue = this.value(tweenName)
      const selectedPropertEnd: SelectedProperty = {
        selectType, property, value: undoValue, name: tweenName,
        changeHandler: (property: string, redoValue: Scalar) => {
          const actionObject: ChangePropertyActionObject = {
            property, target: this, redoValue, undoValue,
            redoSelection: { ...actions.selection },
            undoSelection: { ...actions.selection },
            type: ActionTypeChange,
          }
          actions.create(actionObject)
        }
      }
      // console.log(this.constructor.name, 'selectedProperties', tweenName)
      properties.push(selectedPropertEnd)
    }
    return properties
  }

  selectedProperty(property: Property): boolean {
    const { name } = property
    switch (name) {
      case 'muted': return this.mutable()
      case 'opacity': return this.container
      case 'effects': // return !(this.container || this.isDefaultOrAudio)
      case 'lock': //return this.container && !isAudio(this)
      case 'width':
      case 'height':
      case 'x':
      case 'y': return !(this.isDefaultOrAudio)
    }
    return true
  }



  unload(): void {}
}
