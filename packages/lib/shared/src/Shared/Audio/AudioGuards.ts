import { TypeAudio } from "@moviemasher/runtime-shared";
import { AudioAsset } from "./AudioAsset.js";
import { isAssetObject } from "../Asset/AssetGuards.js";

export const isAudioAssetObject = (value: any): value is AudioAsset => (
  isAssetObject(value) && value.type === TypeAudio
)