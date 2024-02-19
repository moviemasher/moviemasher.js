import type { AssetObject, ManageType } from '@moviemasher/shared-lib/types.js'
import type { ServerAssetManager } from '../types.js'
import type { EventServerAssetDetail, EventServerDecodeStatusDetail, EventServerEncodeStatusDetail, EventServerManagedAssetDetail, EventServerTranscodeStatusDetail } from './event-types.js'

import '../runtime.js'

import { $ASSET, customEventClass } from '@moviemasher/shared-lib/runtime.js'


/**
 * Dispatch to retrieve a managed asset from an asset id or object.
 * @category ServerEvents
 */


export class EventServerManagedAsset extends customEventClass<EventServerManagedAssetDetail>() {
  static Type = 'managed-asset'
  constructor(assetIdOrObject: string | AssetObject) {
    const string = typeof assetIdOrObject === 'string'
    const assetId = string ? assetIdOrObject : assetIdOrObject.id
    const assetObject = string ? undefined : assetIdOrObject
    const detail = { assetId, assetObject }
    super(EventServerManagedAsset.Type, { detail })
  }
}

/**
 * Dispatch to retrieve an asset from an asset id or object.
 * @category ServerEvents
 */

export class EventServerAsset extends customEventClass<EventServerAssetDetail>() {
  static Type = $ASSET
  constructor(assetIdOrObject: string | AssetObject, manager: ServerAssetManager) {
    // console.log('EventServerAsset', !!assetIdOrObject, !!manager)
    const string = typeof assetIdOrObject === 'string'
    const assetId = string ? assetIdOrObject : assetIdOrObject.id
    const assetObject = string ? undefined : assetIdOrObject
    const detail = { assetId, assetObject, manager }
    super(EventServerAsset.Type, { detail })
  }
}
/**
 * Dispatch to release managed assets.
 * @category ServerEvents
 */

export class EventReleaseServerManagedAssets extends customEventClass<string | undefined>() {
  static Type = 'release-assets'
  constructor(detail?: ManageType) {
    super(EventReleaseServerManagedAssets.Type, { detail })
  }
}

/**
 * Dispatch to retrieve a promise that returns progress or decoding if finished.
 * @category ServerEvents
 */

export class EventServerDecodeStatus extends customEventClass<EventServerDecodeStatusDetail>() {
  static Type = 'decode-status'
  constructor(id: string) {
    super(EventServerDecodeStatus.Type, { detail: { id } })
  }
}

/**
 * Dispatch to retrieve a promise that returns encoding if finished.
 * @category ServerEvents
 */

export class EventServerEncodeStatus extends customEventClass<EventServerEncodeStatusDetail>() {
  static Type = 'encode-status'
  constructor(id: string) {
    super(EventServerEncodeStatus.Type, { detail: { id } })
  }
}


/**
 * Dispatch to retrieve a promise that returns progress or transcoding if finished.
 * @category ServerEvents
 */


export class EventServerTranscodeStatus extends customEventClass<EventServerTranscodeStatusDetail>() {
  static Type = 'transcode-status'
  constructor(id: string) {
    super(EventServerTranscodeStatus.Type, { detail: { id } })
  }
}
