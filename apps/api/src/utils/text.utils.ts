const SENTENCE_TO_WORDS = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;

const toWords = (input: string): string[] => {
  return input.match(SENTENCE_TO_WORDS);
}

const toCamelCase = (inputArray: string[]): string => {
  const wordArray = inputArray.map((word, index) => {
    let tempString: string = word.toLowerCase();
    if (index !== 0) {
      tempString = tempString.substring(0, 1).toUpperCase() + tempString.substring(1);
    }
    return tempString;
  })
  return wordArray.join('');
}

export const toCamelCaseFromText = (text: string): string => {
  const words = toWords(text);
  return toCamelCase(words);
}
