import type { ChangeActionObject, ClientAsset, ClientClip, ClientInstance } from '@moviemasher/runtime-client'
import type { InstanceArgs, PropertyId, Scalar, TargetId } from '@moviemasher/runtime-shared'

import { ActionTypeChangeFrame, DataTypeFrame, InstanceClass, assertPopulatedString } from '@moviemasher/lib-shared'
import {  TARGET_CONTAINER, TARGET_CONTENT } from '@moviemasher/runtime-shared'
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
    if (container) this.targetId = TARGET_CONTAINER
    super.initializeProperties(object)
  }

  override targetId: TargetId = TARGET_CONTENT

  unload(): void {}

  override value(name: string): Scalar | undefined {
    switch(name) {
      case 'containerId':
      case 'contentId': return this.asset.id
    }
    return super.value(name)
  }
}
