import type { MashAsset, MashInstance } from '@moviemasher/runtime-shared';
import { InstanceClass } from '../Instance/InstanceClass.js';



export class MashInstanceClass extends InstanceClass implements MashInstance {
  declare asset: MashAsset;
}
