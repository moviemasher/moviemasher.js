import { isIdentified } from '../../Base/Identified';
import { errorThrow } from '../../Helpers/Error/ErrorFunctions';
import { isString, isValueRecord } from '../../Utility/Is';
import { TranslateArgs } from './Translate';


export const isTranslateArgs = (value: any): value is TranslateArgs => {
  return isIdentified(value)
    && (!('locale' in value) || isString(value.locale))
    && (!('values' in value) || isValueRecord(value.values));
};
export function assertTranslateArgs(value: any, name?: string): asserts value is TranslateArgs {
  if (!isTranslateArgs(value))
    errorThrow(value, 'TranslateArgs', name);
}
export const translateArgs = (value: any): TranslateArgs => {
  assertTranslateArgs(value);
  return { id: value.id, locale: value.locale, values: value.values };
};
