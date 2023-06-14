import { TypeAudio } from "@moviemasher/runtime-shared";
import { AudioAsset } from "@moviemasher/runtime-shared";
import { isAssetObject } from "@moviemasher/runtime-shared";

export const isAudioAssetObject = (value: any): value is AudioAsset => (
  isAssetObject(value) && value.type === TypeAudio
)