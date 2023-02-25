export const clone = <T>(array: T[]): T[] => [...array];
export const removeItem = <T>(array: T[], idx: number): T[] => [
  ...clone(array).splice(0, idx),
  ...clone(array).splice(idx + 1),
];
export const addItem = <T>(array: T[], idx: number, item: T): T[] => [
  ...clone(array).splice(0, idx),
  item,
  ...clone(array).splice(idx),
];
