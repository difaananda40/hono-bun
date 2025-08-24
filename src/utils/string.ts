export const humanizeFieldName = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/_+/g, " ") // handle multiple underscores
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
