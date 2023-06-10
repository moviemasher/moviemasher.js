import type { Size, Time, TimeRange } from '@moviemasher/runtime-shared';

export interface CacheOptions {
  audible?: boolean;
  visible?: boolean;
  quantize?: number;
  time?: Time;
  size?: Size;
}

export interface ClipCacheOptions extends CacheOptions {
}

export interface InstanceCacheOptions extends CacheOptions {
}

export interface AssetCacheOptions extends CacheOptions {
}

export interface InstanceCacheArgs extends CacheOptions {
  clipTime: TimeRange;
  time: Time;
  quantize: number;
}

export interface AssetCacheArgs extends CacheOptions {
  assetTime: Time;
}


export interface PreloadOptionsBase extends CacheOptions { }


export interface PreloadArgs extends CacheOptions {
  quantize: number;
  clipTime: TimeRange;
}

export interface PreloadOptions extends Partial<CacheOptions> {
  clipTime?: TimeRange;
}
