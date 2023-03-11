
export interface ForProps<T, U extends JSX.Element> {
  each: readonly T[]
  children: (item: T, index: number) => U
}

export default function For<T, U extends JSX.Element>(props: ForProps<T, U>) {
  const { each, children } = props
  const result: U[] = []
  for (let i = 0; i < each.length; i++) {
    result.push(children(each[i], i))
  }
  return result
}

