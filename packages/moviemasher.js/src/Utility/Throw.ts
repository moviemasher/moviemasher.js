
export const throwError = (value: any, expected: string, name = "value") => {
  const type = typeof value;
  const typeName = type === 'object' ? value.constructor.name : type;
  console.error("throwError", value);
  throw new Error(`${name} is "${value}" (${typeName}) instead of ${expected}`);
};
