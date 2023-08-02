import type { Properties, Property, Scalar, ScalarRecord, SelectorType, Strings, PropertyRecord, TargetId, InstanceArgs, PropertyId, TargetIds } from '@moviemasher/runtime-shared'
import type { Actions, ClientAsset, Selectables, SelectedProperties, SelectedProperty, ClientClip, ClientInstance } from '@moviemasher/runtime-client'
import type { ChangePropertiesActionObject, ChangePropertyActionObject } from '../Masher/Actions/Action/ActionTypes.js'

import { EventManagedAsset, MovieMasher, TypeContainer, TypeContent } from '@moviemasher/runtime-client'
import { ActionTypeChange, ActionTypeChangeFrame, ActionTypeChangeMultiple } from '../../Setup/ActionTypeConstants.js'
import { DataTypeContainerId, DataTypeContentId, DataTypeFrame } from '../../Setup/DataTypeConstants.js'
import { SizingContainer, SizingContent } from '../../Setup/SizingConstants.js'
import { TimingContainer, TimingContent, TimingCustom } from '../../Setup/TimingConstants.js'
import { InstanceClass } from '../../Shared/Instance/InstanceClass.js'
import { assertDefined, assertPopulatedString, assertTrue } from '../../Shared/SharedGuards.js'

import { DotChar, assertAsset, isAudibleAssetType, isVisibleAssetType } from '@moviemasher/runtime-shared'


export class ClientInstanceClass extends InstanceClass implements ClientInstance {
  declare asset: ClientAsset
 
  get clip(): ClientClip { return super.clip as ClientClip }
  set clip(value: ClientClip) { super.clip = value }

  override initializeProperties(object: InstanceArgs): void {
    const { container } = this
    if (container) this.targetId = TypeContainer
    super.initializeProperties(object)
  }
    
  protected override propertiesOfTarget(targetId: TargetId): Properties {
    const properties = super.propertiesOfTarget(targetId)
    // console.log(this.constructor.name, 'propertiesOfTarget', targetId)
    if (targetId === TypeContainer || targetId === TypeContent) {
      properties.push(this.propertyFromClip)
    }
    return properties
  }
  protected get propertyTargetIds(): TargetIds {
    const targetIds = super.propertyTargetIds
    const { targetId } = this
    if (!targetIds.includes(targetId)) targetIds.push(targetId)
    return targetIds
  }
  override propertyFind(name: string): Property | undefined {
    const found = super.propertyFind(name)
    return found ? found : this.clip.propertyFind(name)
  }

  private get propertyFromClip(): Property {
    const { container, clip } = this
    const dataType = container ? DataTypeContainerId : DataTypeContentId
    const property = clip.properties.find(property => property.type === dataType)
    assertDefined(property)

    return property
  }

  selectables(): Selectables { return [this, ...this.clip.selectables()] }

  private get selectorType(): SelectorType {
    return this.container ? TypeContainer : TypeContent
  }

  selectedProperties(actions: Actions, propertyNames: Strings): SelectedProperties {
    const names = this.selectorTypesPropertyNames(propertyNames, this.targetId)
    // console.log(this.constructor.name, 'selectedProperties', propertyNames, names)
    return names.map(name => {
      const property = this.propertyFind(name) 
      if (property) return this.selectedProperty(actions, property)

      const { propertyFromClip } = this
      assertTrue(name === propertyFromClip.name, name)

      return this.selectedPropertyFromClip(actions, propertyFromClip)
    })
  }

  private selectedProperty(actions: Actions, property: Property): SelectedProperty {
    const { targetId, name, type: dataType } = property
    const undoValue = this.value(name)
    const type = dataType === DataTypeFrame ? ActionTypeChangeFrame : ActionTypeChange
    const propertyId = [targetId, name].join(DotChar) as PropertyId
    const selectedProperty: SelectedProperty = {
      propertyId, property, value: undoValue,
      changeHandler: (property: string, redoValue?: Scalar) => {
        assertPopulatedString(property)
        const actionObject: ChangePropertyActionObject = {
          type, property, target: this, redoValue, undoValue,
          redoSelection: actions.selection,
          undoSelection: actions.selection,
        }
        actions.create(actionObject)
      }
    }
    return selectedProperty
  }

  private selectedPropertyFromClip(actions: Actions, property: Property): SelectedProperty {
    console.log(this.constructor.name, 'selectedPropertyFromClip', property.name)
    const { container, clip, selectorType, asset } = this
    
    // add contentId or containerId from clip, as if it were my property 
    const { id: undoValue } = asset
    const { timing, sizing } = clip
  
  
    const { name, targetId } = property
    const undoValues: ScalarRecord = { timing, sizing, [name]: undoValue }
    const values: ScalarRecord = { ...undoValues }
    const relevantTiming = container ? TimingContainer : TimingContent
    const relevantSizing = container ? SizingContainer : SizingContent
    const timingBound = timing === relevantTiming
    const sizingBound = sizing === relevantSizing
    const propertyId = [targetId, name].join(DotChar) as PropertyId

    const selectedProperty: SelectedProperty = {
      propertyId, property, value: undoValue,
      changeHandler: (property: string, redoValue?: Scalar) => {
        assertPopulatedString(redoValue)

        const redoValues = { ...values, [name]: redoValue }
        if (timingBound || sizingBound) {
          const event = new EventManagedAsset(redoValue)
          MovieMasher.eventDispatcher.dispatch(event)
          const {asset} = event.detail
          assertAsset(asset)
          const { type } = asset
          if (timingBound && !isAudibleAssetType(type)) {
            redoValues.timing = TimingCustom
          }
          if (sizingBound && !isVisibleAssetType(type)) {
            redoValues.sizing = container ? SizingContent : SizingContainer
          }
        }
        const actionObject: ChangePropertiesActionObject = {
          type: ActionTypeChangeMultiple,
          property, target: clip, redoValues, undoValues,
          redoSelection: actions.selection,
          undoSelection: actions.selection,
        }
        actions.create(actionObject)
      },
    }
    return selectedProperty
  }

  targetId: TargetId = TypeContent

  unload(): void {}

  override value(name: string): Scalar | undefined {
    switch(name) {
      case 'containerId':
      case 'contentId': return this.asset.id
    }
    return super.value(name)
  }
}
