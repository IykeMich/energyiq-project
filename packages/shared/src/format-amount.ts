function countOccurrences(text: string, substring: string): number {
  let count = 0;
  let index = text.indexOf(substring);

  while (index !== -1) {
    count++;
    index = text.indexOf(substring, index + 1);
  }
  return count;
}

/** Adds thousands separators while typing, e.g. "1234" -> "1,234", "1234." -> "1,234.". */
export function formatAmount(amount: string): string {
  const numeric = parseFloat(amount.replace(/,/g, ''));
  if (amount.endsWith('.')) return numeric.toLocaleString('en-US') + '.';
  if (amount.includes('.') && countOccurrences(amount, '.') === 1) {
    const [wholePart, decimalPart] = amount.split('.');
    return formatAmount(wholePart) + '.' + decimalPart;
  }
  if (amount.includes('.')) return amount;
  return numeric.toLocaleString('en-US');
}

/** Same as formatAmount but pads/truncates the decimal part to exactly 2 digits. */
export function formatAmountDp(amount: string): string {
  if (!amount || isNaN(parseFloat(amount.replace(/,/g, '')))) return '0.00';

  const clean = amount.replace(/,/g, '');

  if (clean.endsWith('.')) {
    return parseFloat(clean).toLocaleString('en-US') + '.00';
  }

  if (clean.includes('.') && countOccurrences(clean, '.') === 1) {
    const [wholePart, decimalPart] = clean.split('.');
    const formattedWhole = parseFloat(wholePart).toLocaleString('en-US');

    let formattedDecimal = decimalPart;
    if (decimalPart.length === 0) formattedDecimal = '00';
    else if (decimalPart.length === 1) formattedDecimal = decimalPart + '0';
    else if (decimalPart.length > 2) formattedDecimal = decimalPart.substring(0, 2);

    return formattedWhole + '.' + formattedDecimal;
  }

  return parseFloat(clean).toLocaleString('en-US') + '.00';
}

/** Strips non-numeric characters first, then formats like formatAmountDp. */
export function enhancedFormatAmount(amount: string): string {
  if (!amount) return '0.00';
  const cleaned = amount.replace(/[^\d.,]/g, '');

  if (cleaned.includes('.')) {
    const [wholePart, decimalPart] = cleaned.split('.');
    const wholeFormatted = formatAmount(wholePart);

    let decimalFormatted: string;
    if (decimalPart.length === 0) decimalFormatted = '00';
    else if (decimalPart.length === 1) decimalFormatted = decimalPart + '0';
    else {
      const rounded = Math.round(parseFloat('0.' + decimalPart) * 100) / 100;
      decimalFormatted = rounded.toString().substring(2);
      if (decimalFormatted.length === 1) decimalFormatted += '0';
    }
    return wholeFormatted + '.' + decimalFormatted;
  }

  return formatAmount(cleaned);
}

/** Always renders exactly 2 decimal places, e.g. "1234.5" -> "1,234.50". */
export function formatAmountWithDecimals(amount: string): string {
  if (!amount) return '0.00';
  const cleaned = amount.replace(/[^\d.,]/g, '').replace(/,/g, '');
  let numeric: number;
  let decimalPlaces = 0;

  if (cleaned.includes('.')) {
    const [wholePart, decimalPart] = cleaned.split('.');
    numeric = parseFloat(wholePart + '.' + (decimalPart || '0'));
    decimalPlaces = decimalPart?.length || 0;
  } else {
    numeric = parseFloat(cleaned);
  }

  if (isNaN(numeric)) return '0.00';
  if (decimalPlaces > 2) numeric = Math.round(numeric * 100) / 100;

  return numeric.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Formats a number in abbreviated form (Trillion, Billion, Million, etc.)
 * Examples: 60100010000 -> "60.1B", 1200000000000 -> "1.2T", 5000000 -> "5.0M"
 */
export function formatAmountAbbreviated(amount: string | number, decimals: number = 1): string {
  const numeric = typeof amount === 'string'
    ? parseFloat(amount.replace(/,/g, ''))
    : amount;

  if (isNaN(numeric) || numeric === 0) return '0';

  const absValue = Math.abs(numeric);
  const sign = numeric < 0 ? '-' : '';

  if (absValue >= 1_000_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000_000).toFixed(decimals)}T`;
  }
  if (absValue >= 1_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000).toFixed(decimals)}B`;
  }
  if (absValue >= 1_000_000) {
    return `${sign}${(absValue / 1_000_000).toFixed(decimals)}M`;
  }
  if (absValue >= 1_000) {
    return `${sign}${(absValue / 1_000).toFixed(decimals)}K`;
  }

  return numeric.toFixed(decimals === 0 ? 0 : decimals);
}

export function maskCardNumber(cardNumber: string): string {
  if (cardNumber.length !== 16) throw new Error('Input must be a 16-digit number');
  return `${cardNumber.slice(0, 4)} **** **** ${cardNumber.slice(12)}`;
}
