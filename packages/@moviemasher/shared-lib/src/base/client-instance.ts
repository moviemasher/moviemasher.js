import type { ClientAsset, ClientClip, ClientInstance, ChangeEditObject, PropertyId, Scalar } from '../types.js'

import { assertDefined, isChangePropertyEditObject } from '../utility/guards.js'
import { DOT, $FRAME } from '../runtime.js'
import { InstanceClass } from '../base/instance.js'

export class ClientInstanceClass extends InstanceClass implements ClientInstance {
  declare asset: ClientAsset
 
  override changeScalar(propertyId: PropertyId, scalar?: Scalar): ChangeEditObject {
    const object = super.changeScalar(propertyId, scalar)
    if (!isChangePropertyEditObject(object)) return object

    const name = propertyId.split(DOT).pop()
    assertDefined(name)

    const property = this.propertyFind(name) 
    if (property?.type === $FRAME) object.type = $FRAME
    return object
  }
  
  override get clip(): ClientClip { return super.clip as ClientClip }
  override set clip(value: ClientClip) { super.clip = value }

  unload(): void {}

  override value(name: string): Scalar | undefined {
    switch(name) {
      case 'containerId':
      case 'contentId': {
        console.trace(this.constructor.name, 'ClientInstanceClass value', name)
        return this.asset.id
      }
    }
    return super.value(name)
  }
}
