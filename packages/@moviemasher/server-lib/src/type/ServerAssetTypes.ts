import type { AudioAsset, ImageAsset, ServerAudibleAsset, ServerVisibleAsset, VideoAsset } from '@moviemasher/shared-lib/types.js';

export interface ServerAudioAsset extends AudioAsset, ServerAudibleAsset {}
export interface ServerImageAsset extends ImageAsset, ServerVisibleAsset {}
export interface ServerVideoAsset extends VideoAsset, ServerAudibleAsset, ServerVisibleAsset {}

