import type { ChangeActionObject, ClientAsset, ClientClip, ClientInstance } from '@moviemasher/runtime-client'
import type { InstanceArgs, PropertyId, Scalar, TargetId } from '@moviemasher/runtime-shared'

import { ActionTypeChangeFrame, DataTypeFrame, InstanceClass, assertPopulatedString } from '@moviemasher/lib-shared'
import {  CONTAINER, CONTENT } from '@moviemasher/runtime-shared'
import { isChangePropertyActionObject } from '../Client/Masher/Actions/Action/ActionFunctions.js'
import { DOT } from '@moviemasher/lib-shared'

export class ClientInstanceClass extends InstanceClass implements ClientInstance {
  declare asset: ClientAsset
 

  override changeScalar(propertyId: PropertyId, scalar?: Scalar): ChangeActionObject {
    const object = super.changeScalar(propertyId, scalar)
    if (!isChangePropertyActionObject(object)) return object
    const name = propertyId.split(DOT).pop()
    assertPopulatedString(name)

    const property = this.propertyFind(name) 
    if (property?.type === DataTypeFrame) object.type = ActionTypeChangeFrame
    return object
  }
  override get clip(): ClientClip { return super.clip as ClientClip }
  override set clip(value: ClientClip) { super.clip = value }

  override initializeProperties(object: InstanceArgs): void {
    const { container } = this
    if (container) this.targetId = CONTAINER
    super.initializeProperties(object)
  }
    
  // protected override propertiesOfTarget(targetId: TargetId): Properties {
  //   const properties = super.propertiesOfTarget(targetId)
  //   // console.log(this.constructor.name, 'propertiesOfTarget', targetId)
  //   if (targetId === CONTAINER || targetId === CONTENT) {
  //     properties.push(this.propertyFromClip)
  //   }
  //   return properties
  // }
  // protected get propertyTargetIds(): TargetIds {
  //   const targetIds = super.propertyTargetIds
  //   const { targetId } = this
  //   if (!targetIds.includes(targetId)) targetIds.push(targetId)
  //   return targetIds
  // }
  // override propertyFind(name: string): Property | undefined {
  //   const found = super.propertyFind(name)
  //   return found ? found : this.clip.propertyFind(name)
  // }

  // private get propertyFromClip(): Property {
  //   const { container, clip } = this
  //   const dataType = container ? DataTypeContainerId : DataTypeContentId
  //   const property = clip.properties.find(property => property.type === dataType)
  //   assertDefined(property)

  //   return property
  // }


  // private get selectorType(): SelectorType {
  //   return this.container ? CONTAINER : CONTENT
  // }

  // selectedProperties(_actions: Actions, _propertyNames: Strings): SelectedProperties {
  //   return []
  //   // const names = this.selectorTypesPropertyNames(propertyNames, this.targetId)
  //   // // console.log(this.constructor.name, 'selectedProperties', propertyNames, names)
  //   // return names.flatMap(name => {
  //   //   const property = this.propertyFind(name) 
  //   //   if (!property) return []

  //   //   return [this.mySelectedProperty(actions, property)]
  //   // })
  // }



  override targetId: TargetId = CONTENT

  unload(): void {}

  override value(name: string): Scalar | undefined {
    switch(name) {
      case 'containerId':
      case 'contentId': return this.asset.id
    }
    return super.value(name)
  }
}
