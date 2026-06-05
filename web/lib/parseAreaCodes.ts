const AREA_CODE_REGEX = /\b([1-9]|1\d|2[0-4])\b/g;

export const parseAreaCodes = (input: string): string[] => {
  const matches = input.match(AREA_CODE_REGEX);
  if (!matches) return [];
  return [...new Set(matches)];
};

export const parseAreaCode = (searchTerm: string): string | undefined => {
  const match = searchTerm.trim().match(AREA_CODE_REGEX);
  return match?.[0];
};
