import { Constrained, Instance, MashAsset, MashInstance } from "@moviemasher/runtime-shared";

export function MashInstanceMixin<T extends Constrained<Instance>>(Base: T):
  T & Constrained<MashInstance> {
  return class extends Base implements MashInstance {
    declare asset: MashAsset
  }
}