import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { ClientClip, ClientTrack, MashClientAsset, MashClientInstance } from './MashClientTypes.js'
import { isClip } from '../../Shared/Mash/Clip/ClipFunctions.js'
import { isTrack } from '../../Shared/Mash/Track/TrackGuards.js'
import { isInstance } from '../../Shared/Instance/InstanceGuards.js'
import { isMashAsset } from '../../Shared/Mash/MashGuards.js'

export const isMashClientAsset = (value: any): value is MashClientAsset => {
  return isMashAsset(value) && 'addClipToTrack' in value
}

export function assertMashClientAsset(value: any, name?: string): asserts value is MashClientAsset {
  if (!isMashClientAsset(value)) errorThrow(value, 'MashClientAsset', name)
}

export const isMashClientInstance = (value: any): value is MashClientInstance => {
  return isInstance(value) && 'asset' in value && isMashClientAsset(value.asset) 
}

export function assertMashClientInstance(value: any, name?: string): asserts value is MashClientInstance {
  if (!isMashClientInstance(value)) errorThrow(value, 'MashClientInstance', name)
}

export const isClientClip = (value: any): value is ClientClip => {
  return isClip(value) && 'clipIcon' in value;
}

export const isClientTrack = (value: any): value is ClientTrack => {
  return isTrack(value) && 'addClips' in value;
}
