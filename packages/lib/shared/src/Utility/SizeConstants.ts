import { Size } from '@moviemasher/runtime-shared';
import { sizeScale } from './SizeFunctions.js';



export const SizeZero = { width: 0, height: 0 };

export const SizeOutput: Size = { width: 1920, height: 1080 };

export const SizePreview = sizeScale(SizeOutput, 0.25, 0.25);

export const SizeIcon = sizeScale(SizePreview, 0.5, 0.5);
