export type Comparator<T> = (a: T, b: T) => number;

export const compareStrings: Comparator<string> = (a, b) => {
  return a.localeCompare(b);
};

export const compareBooleans: Comparator<boolean> = (a, b) => {
  if (a === b) {
    return 0;
  }
  return a ? 1 : -1;
};

export const compareNumbers: Comparator<number> = (a, b) => {
  return a - b;
};

export const compareStringDates: Comparator<string> = (a, b) => {
  const dateA = new Date(a);
  const dateB = new Date(b);
  return dateA.getTime() - dateB.getTime();
};
