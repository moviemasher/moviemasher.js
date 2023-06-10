import type { VideoAsset } from "./VideoAsset.js";
import { InstanceObject, InstanceArgs, Instance } from '../Instance/Instance.js';

export interface VideoInstance extends Instance {
  asset: VideoAsset;
}

export interface VideoInstanceObject extends InstanceObject { }

export interface VideoInstanceArgs extends InstanceArgs, VideoInstanceObject {
  asset: VideoAsset;
}
