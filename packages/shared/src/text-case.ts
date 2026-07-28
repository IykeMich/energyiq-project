export function isStringNullOrEmpty(value: string | null | undefined): boolean {
  return value == null || value === '';
}

export function toTitleCase(sentence: string): string {
  const words = sentence?.split(' ');
  return words
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/** Detects camelCase/snake_case input and converts it to a normal sentence, e.g. "orderStatus" -> "Order status". */
export function convertToSentenceCase(input: string): string {
  const isCamelCase = /[a-z][A-Z]/.test(input);
  const isSnakeCase = /_/.test(input);
  if (!isCamelCase && !isSnakeCase) return toTitleCase(input);

  let result = input;

  if (isSnakeCase) result = result.replace(/_/g, ' ');
  if (isCamelCase) result = result.replace(/([a-z])([A-Z])/g, '$1 $2');

  result = result.replace(/^./, (character) => character.toUpperCase());
  return toTitleCase(result);
}

export function ultimateRemoveWordFromASentence(sentence: string, word: string): string {
  return sentence.replace(new RegExp(`\\b${word}\\b`, 'g'), '').replace(/\s{2,}/g, ' ').trim();
}

export function shortenWord(word: string, replace = '...', length = 28): string {
  return word.length >= length
    ? word.replace(/(\r\n|\n|\r)/gm, '').slice(0, length) + replace
    : word.replace(/(\r\n|\n|\r)/gm, '');
}

export function splitWords(text: string, start = 0, end = 1): string {
  return text ? `${text.split(' ')[start]} ${text.split(' ')[end]}` : '';
}

export function replaceUnderscoresWithSpaces(text: string): string {
  if (!text) return '';
  return text.replace(/_/g, ' ');
}

export function underscoreToTitleCase(text: string): string {
  if (!text) return '';
  return toTitleCase(replaceUnderscoresWithSpaces(text));
}
