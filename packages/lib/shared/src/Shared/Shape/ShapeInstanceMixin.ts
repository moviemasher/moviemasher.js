import type { ShapeInstanceObject, VisibleInstance } from '@moviemasher/runtime-shared';
import type { Rect, IntrinsicOptions } from '@moviemasher/runtime-shared';
import type { Constrained } from '@moviemasher/runtime-shared';
import type { ShapeAsset, ShapeInstance } from '@moviemasher/runtime-shared';
import { POINT_ZERO } from '@moviemasher/runtime-shared';
import { DataTypePercent } from '../../Setup/DataTypeConstants.js';
import { propertyInstance } from '../../Setup/PropertyFunctions.js';
import { End } from '@moviemasher/runtime-shared';
import { TypeContainer } from '@moviemasher/runtime-client';



export function ShapeInstanceMixin<T extends Constrained<VisibleInstance>>(Base: T):
  T & Constrained<ShapeInstance> {
  return class extends Base implements ShapeInstance {

    declare asset: ShapeAsset;

    hasIntrinsicSizing = true;

    override initializeProperties(object: ShapeInstanceObject) {
      this.properties.push(propertyInstance({
        targetId: TypeContainer, name: 'width', type: DataTypePercent,
        min: 0, max: 2, step: 0.01,
        defaultValue: 1, tweens: true,
      }));
      this.properties.push(propertyInstance({
        targetId: TypeContainer, name: `width${End}`,
        type: DataTypePercent, min: 0, max: 2, step: 0.01,
        undefinedAllowed: true, tweens: true,
      }));
      this.properties.push(propertyInstance({
        targetId: TypeContainer, name: 'height', type: DataTypePercent,
        min: 0, max: 2, step: 0.01, tweens: true,
        defaultValue: 1,
      }));
      this.properties.push(propertyInstance({
        targetId: TypeContainer, name: `height${End}`,
        type: DataTypePercent, undefinedAllowed: true, tweens: true,
        min: 0, max: 2, step: 0.01,
      }));
      super.initializeProperties(object);
    }
    intrinsicRect(_editing = false): Rect {
      const { pathHeight: height, pathWidth: width } = this.asset;
      // console.log(this.constructor.name, 'intrinsicRect', this.assetId)
      return { width, height, ...POINT_ZERO };
    }

    intrinsicsKnown(options: IntrinsicOptions): boolean { return true; }
  };
}
