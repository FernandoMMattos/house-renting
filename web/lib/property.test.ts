import { describe, it, expect } from 'vitest'
import { filtersToParams, searchParamsToFilters } from './property'
import { EMPTY_FILTERS } from '@/types/filters'

describe('filtersToParams', () => {
  it('returns an empty object for EMPTY_FILTERS', () => {
    expect(filtersToParams(EMPTY_FILTERS)).toEqual({})
  })

  it('drops empty string values', () => {
    const result = filtersToParams({ roomType: '', propertyType: 'APARTMENT' })
    expect(result).not.toHaveProperty('roomType')
    expect(result.propertyType).toBe('APARTMENT')
  })

  it('drops empty arrays', () => {
    const result = filtersToParams({ areaCodes: [] })
    expect(result).not.toHaveProperty('areaCodes')
  })

  it('joins non-empty arrays with commas', () => {
    const result = filtersToParams({ areaCodes: ['D01', 'D02', 'D07'] })
    expect(result.areaCodes).toBe('D01,D02,D07')
  })

  it('keeps non-empty string values unchanged', () => {
    const result = filtersToParams({ minPrice: '500', maxPrice: '2000' })
    expect(result.minPrice).toBe('500')
    expect(result.maxPrice).toBe('2000')
  })

  it('handles a mix of populated and empty fields correctly', () => {
    const result = filtersToParams({
      areaCodes: ['D01'],
      roomType: 'SINGLE',
      propertyType: '',
      minPrice: '',
      maxPrice: '1500',
    })
    expect(result).toEqual({ areaCodes: 'D01', roomType: 'SINGLE', maxPrice: '1500' })
  })

  it('preserves a single-element array as a plain string', () => {
    const result = filtersToParams({ areaCodes: ['D04'] })
    expect(result.areaCodes).toBe('D04')
  })
})

describe('searchParamsToFilters', () => {
  it('returns EMPTY_FILTERS when given an empty object', () => {
    expect(searchParamsToFilters({})).toEqual(EMPTY_FILTERS)
  })

  it('splits a comma-separated areaCodes string into an array', () => {
    const result = searchParamsToFilters({ areaCodes: 'D01,D02,D07' })
    expect(result.areaCodes).toEqual(['D01', 'D02', 'D07'])
  })

  it('returns a single-element array for a single areaCode', () => {
    const result = searchParamsToFilters({ areaCodes: 'D14' })
    expect(result.areaCodes).toEqual(['D14'])
  })

  it('returns an empty array when areaCodes is undefined', () => {
    const result = searchParamsToFilters({ areaCodes: undefined })
    expect(result.areaCodes).toEqual([])
  })

  it('maps all string filter params to their respective fields', () => {
    const result = searchParamsToFilters({
      roomType: 'DOUBLE',
      propertyType: 'APARTMENT',
      minPrice: '800',
      maxPrice: '2000',
      bedrooms: '2',
      bathrooms: '1',
      sharingWith: '0',
    })
    expect(result.roomType).toBe('DOUBLE')
    expect(result.propertyType).toBe('APARTMENT')
    expect(result.minPrice).toBe('800')
    expect(result.maxPrice).toBe('2000')
    expect(result.bedrooms).toBe('2')
    expect(result.bathrooms).toBe('1')
    expect(result.sharingWith).toBe('0')
  })

  it('defaults missing string params to an empty string', () => {
    const result = searchParamsToFilters({ roomType: 'SINGLE' })
    expect(result.propertyType).toBe('')
    expect(result.minPrice).toBe('')
    expect(result.maxPrice).toBe('')
    expect(result.bedrooms).toBe('')
    expect(result.bathrooms).toBe('')
    expect(result.sharingWith).toBe('')
  })
})
