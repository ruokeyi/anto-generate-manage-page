
export function toSnakeCase(anyString: string) {
  anyString = anyString.replace(/TID/g, 'Tid');
  return anyString.replace(/([A-Z\-])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * 单词到首字母大写
 * @param {string} word
 * @returns {string}
 */
export function toTitleCase(word: string) {
  return `${word[0].toUpperCase()}${word.slice(1)}`;
}

/**
 * snake-case字符串到全首字母大写
 * @param {string} snakeStr
 * @returns {string}
 */
export function toPascalCase(snakeStr: string) {
  return snakeStr
    .split(/[_\-]/)
    .filter(x => x)
    .map(toTitleCase)
    .join('');
}

/**
 * snake-case字符串到首字母小写其他单词首字母大写
 * @param {string} snakeStr
 * @returns {string}
 */
export function toCamelCase(snakeStr: string) {
  let pascal = toPascalCase(snakeStr);
  return pascal[0].toLowerCase() + pascal.slice(1);
}
