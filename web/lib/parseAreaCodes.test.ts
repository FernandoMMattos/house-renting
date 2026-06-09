import { describe, it, expect } from 'vitest'
import { parseAreaCodes, parseAreaCode } from './parseAreaCodes'

describe('parseAreaCodes', () => {
  it('returns an empty array for an empty string', () => {
    expect(parseAreaCodes('')).toEqual([])
  })

  it('extracts valid single-digit area codes (1–9)', () => {
    expect(parseAreaCodes('1 2 3 9')).toEqual(['1', '2', '3', '9'])
  })

  it('extracts valid two-digit codes (10–24)', () => {
    expect(parseAreaCodes('10 15 20 24')).toEqual(['10', '15', '20', '24'])
  })

  it('ignores 0 and numbers above 24', () => {
    expect(parseAreaCodes('0 25 30 99')).toEqual([])
  })

  it('deduplicates repeated codes', () => {
    expect(parseAreaCodes('1 1 3 3 3')).toEqual(['1', '3'])
  })

  it('extracts codes mixed with arbitrary text', () => {
    const result = parseAreaCodes('Dublin 3 and Dublin 7')
    expect(result).toContain('3')
    expect(result).toContain('7')
  })

  it('does not match digits embedded inside longer tokens', () => {
    // '1' is preceded by word char '0', so no leading word boundary
    expect(parseAreaCodes('D01 D02')).toEqual([])
  })

  it('handles a realistic comma-separated input', () => {
    expect(parseAreaCodes('1, 4, 18')).toEqual(['1', '4', '18'])
  })
})

describe('parseAreaCode', () => {
  it('returns the first valid code found in the string', () => {
    expect(parseAreaCode('area 5')).toBe('5')
  })

  it('returns undefined when no valid code is present', () => {
    expect(parseAreaCode('Dublin')).toBeUndefined()
  })

  it('trims leading and trailing whitespace before matching', () => {
    expect(parseAreaCode('  8  ')).toBe('8')
  })

  it('returns only the first code when multiple are present', () => {
    expect(parseAreaCode('1 2 3')).toBe('1')
  })

  it('returns undefined for out-of-range numbers', () => {
    expect(parseAreaCode('25')).toBeUndefined()
  })
})
