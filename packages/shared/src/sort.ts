type SortType = 'date' | 'number' | 'string';

/** Sorts descending (newest/highest/last-alphabetically first). */
export function dynamicSort<T>(array: T[], key: keyof T, type: SortType = 'string'): T[] {
  if (!array?.length) return [];
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    switch (type) {
      case 'date':
        return new Date(valueB as string).getTime() - new Date(valueA as string).getTime();
      case 'number':
        return Number(valueB) - Number(valueA);
      case 'string':
      default:
        return (valueB as string).localeCompare(valueA as string);
    }
  });
}

/** Sorts ascending (oldest/lowest/first-alphabetically first). */
export function dynamicADSort<T>(array: T[], key: keyof T, type: SortType = 'string'): T[] {
  if (!array?.length) return [];
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    switch (type) {
      case 'date':
        return new Date(valueA as string).getTime() - new Date(valueB as string).getTime();
      case 'number':
        return Number(valueA ?? 0) - Number(valueB ?? 0);
      case 'string':
      default:
        return (valueA?.toString() || '').localeCompare(valueB?.toString() || '');
    }
  });
}

export function sortAlphabetically<T>(
  array: T[],
  key?: keyof T | null,
  options: {
    ignoreCase?: boolean;
    locale?: string | string[];
    direction?: 'ascending' | 'descending';
  } = {},
): T[] {
  const { ignoreCase = true, locale = 'en', direction = 'ascending' } = options;
  const result = [...array];

  return result.sort((a, b) => {
    let valueA: string;
    let valueB: string;

    if (key && typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
      valueA = String(a[key] || '');
      valueB = String(b[key] || '');
    } else {
      valueA = String(a);
      valueB = String(b);
    }

    const compareA = ignoreCase ? valueA.toLowerCase() : valueA;
    const compareB = ignoreCase ? valueB.toLowerCase() : valueB;

    const comparison = compareA.localeCompare(compareB, locale);
    return direction === 'ascending' ? comparison : -comparison;
  });
}
