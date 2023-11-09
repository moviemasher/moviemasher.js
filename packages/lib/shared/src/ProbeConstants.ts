import { AlphaProbe, AudibleProbe, DurationProbe, SizeProbe, ProbeKinds } from './ProbeTypes.js';


export const ProbeAlpha: AlphaProbe = 'alpha';
export const ProbeAudible: AudibleProbe = 'audible';
export const ProbeDuration: DurationProbe = 'duration';
export const ProbeSize: SizeProbe = 'size';

export const KindsProbe: ProbeKinds = [ProbeAlpha, ProbeAudible, ProbeDuration, ProbeSize];
