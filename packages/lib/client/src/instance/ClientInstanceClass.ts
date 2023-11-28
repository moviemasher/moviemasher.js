import type { ChangeEditObject, ClientAsset, ClientClip, ClientInstance } from '@moviemasher/runtime-client'
import type { InstanceArgs, PropertyId, Scalar, TargetId } from '@moviemasher/runtime-shared'

import { assertPopulatedString } from '@moviemasher/lib-shared/utility/guards.js'
import { CHANGE_FRAME } from '@moviemasher/runtime-client'
import { CONTAINER, CONTENT, DOT, FRAME } from '@moviemasher/runtime-shared'
import { isChangePropertyEditObject } from '../guards/EditGuards.js'
import { InstanceClass } from '@moviemasher/lib-shared/base/instance.js'

export class ClientInstanceClass extends InstanceClass implements ClientInstance {
  declare asset: ClientAsset
 

  override changeScalar(propertyId: PropertyId, scalar?: Scalar): ChangeEditObject {
    const object = super.changeScalar(propertyId, scalar)
    if (!isChangePropertyEditObject(object)) return object
    const name = propertyId.split(DOT).pop()
    assertPopulatedString(name)

    const property = this.propertyFind(name) 
    if (property?.type === FRAME) object.type = CHANGE_FRAME
    return object
  }
  override get clip(): ClientClip { return super.clip as ClientClip }
  override set clip(value: ClientClip) { super.clip = value }

  override initializeProperties(object: InstanceArgs): void {
    const { container } = this
    if (container) this.targetId = CONTAINER
    super.initializeProperties(object)
  }

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
