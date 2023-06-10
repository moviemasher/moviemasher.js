import { PropertiedClass } from './PropertiedClass.js';
import { Propertied } from '@moviemasher/runtime-shared';


export const isPropertied = (value: any): value is Propertied => (
  value instanceof PropertiedClass
);
