import { Size, Time, TypeVideo } from "@moviemasher/runtime-shared";
import { MashServerAssetClass } from "./MashServerClasses.js";
import { VideoServerAsset } from '../ServerAsset.js';


export class ServerMashedVideoAssetClass extends MashServerAssetClass implements VideoServerAsset {

  audio = false;
  audioUrl = '';
  duration = 0;
  frames(quantize: number): number {
    throw new Error('Method not implemented.');
  }
  loop = false;
  previewSize?: Size | undefined;
  sourceSize?: Size | undefined;
  alpha?: boolean | undefined;

  type = TypeVideo;

}
