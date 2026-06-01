export const parseAreaCodes = (input: string): number[] => {
  const matches = input.match(/\b([1-9]|1\d|2[0-4])\b/g);
  if (!matches) return [];

  const codes = [...new Set(matches.map(Number))].filter(
    (n) => n >= 1 && n <= 24,
  );
  return codes;
};
