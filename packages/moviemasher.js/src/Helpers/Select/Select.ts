
export type IndexHandler<OBJECT = any, INDEX = number> = (effect: OBJECT, insertIndex?: INDEX) => void;
