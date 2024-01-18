import type { ClientAsset, ClientClip, ClientInstance } from '../types.js'
import type { ChangeEditObject, Directions, InstanceArgs, Property, PropertyId, PropertySize, Scalar, TargetId } from '@moviemasher/shared-lib/types.js'

import { assertPopulatedString } from '@moviemasher/shared-lib/utility/guards.js'
import { CHANGE_FRAME } from '../runtime.js'
import { BOTTOM, CONTAINER, CONTENT, DIRECTIONS_ALL, DOT, END, FLIP, FRAME, HEIGHT, LEFT, RIGHT, TOP, WIDTH } from '@moviemasher/shared-lib/runtime.js'
import { isChangePropertyEditObject } from '../guards/EditGuards.js'
import { InstanceClass } from '@moviemasher/shared-lib/base/instance.js'

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

  get directions(): Directions { 
    switch (this.propertySize) {
      case WIDTH: return [LEFT, RIGHT]
      case HEIGHT: return [TOP, BOTTOM]
    }
    return DIRECTIONS_ALL
  }
  
  override initializeProperties(object: InstanceArgs): void {
    const { container } = this
    if (container) this.targetId = CONTAINER
    super.initializeProperties(object)
  }
  
  private shouldSelectPropertySize(propertySize: PropertySize): boolean {
    const { propertySize: size } = this
    if (!size) return true

    const { sizeAspect } = this
    const { size: mashSize } = this.clip.track.mash
    const mashPortrait = mashSize.width < mashSize.height
    const flipped = mashPortrait && sizeAspect === FLIP
    const property = flipped ? size === WIDTH ? HEIGHT : WIDTH : size
    // console.log(this.constructor.name, 'shouldSelectPropertySize', {mashPortrait, flipped, size, property, propertySize})
    return property === propertySize
  }
  
  protected override shouldSelectProperty(property: Property, targetId: TargetId): Property | undefined {
    if (targetId !== property.targetId) return 
    
    const { name } = property

    switch (name) {
      case HEIGHT:
      case `${HEIGHT}${END}`: 
        return this.shouldSelectPropertySize(HEIGHT) ? property : undefined
      case WIDTH:
      case `${WIDTH}${END}`: 
        return this.shouldSelectPropertySize(WIDTH) ? property : undefined
    }
    return super.shouldSelectProperty(property, targetId)
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
