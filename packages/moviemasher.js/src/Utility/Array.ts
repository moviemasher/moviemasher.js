
export const arrayLast = (array: any[]): any => array[array.length - 1 ]

export const arraySet = (array: any[], items: any[]) => {
  array.splice(0, array.length, ...items)
  return array
}