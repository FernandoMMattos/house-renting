import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import usePropertyFilters from './usePropertyFilters'
import { EMPTY_FILTERS } from '@/types/filters'

const mockReplace = vi.fn()
let mockSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockSearchParams,
}))

describe('usePropertyFilters', () => {
  beforeEach(() => {
    mockReplace.mockReset()
    mockSearchParams = new URLSearchParams()
  })

  it('returns EMPTY_FILTERS when the URL has no search params', () => {
    const { result } = renderHook(() => usePropertyFilters())
    expect(result.current.filters).toEqual(EMPTY_FILTERS)
  })

  it('reads roomType from the URL search params', () => {
    mockSearchParams = new URLSearchParams('roomType=SINGLE')
    const { result } = renderHook(() => usePropertyFilters())
    expect(result.current.filters.roomType).toBe('SINGLE')
  })

  it('reads areaCodes as a split array from the URL search params', () => {
    mockSearchParams = new URLSearchParams('areaCodes=D01,D02')
    const { result } = renderHook(() => usePropertyFilters())
    expect(result.current.filters.areaCodes).toEqual(['D01', 'D02'])
  })

  it('reads a price range filter from the URL', () => {
    mockSearchParams = new URLSearchParams('minPrice=500&maxPrice=2000')
    const { result } = renderHook(() => usePropertyFilters())
    expect(result.current.filters.minPrice).toBe('500')
    expect(result.current.filters.maxPrice).toBe('2000')
  })

  it('handleChange updates a single field and navigates to the new URL', () => {
    const { result } = renderHook(() => usePropertyFilters())

    act(() => {
      result.current.handleChange('roomType', 'DOUBLE')
    })

    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining('roomType=DOUBLE'),
    )
  })

  it('handleChange preserves existing filters while updating the target field', () => {
    mockSearchParams = new URLSearchParams('roomType=SINGLE&minPrice=500')
    const { result } = renderHook(() => usePropertyFilters())

    act(() => {
      result.current.handleChange('maxPrice', '2000')
    })

    const url = mockReplace.mock.calls[0][0] as string
    expect(url).toContain('roomType=SINGLE')
    expect(url).toContain('minPrice=500')
    expect(url).toContain('maxPrice=2000')
  })

  it('handleClear navigates to /properties with no query params', () => {
    mockSearchParams = new URLSearchParams('roomType=SINGLE&minPrice=500')
    const { result } = renderHook(() => usePropertyFilters())

    act(() => {
      result.current.handleClear()
    })

    expect(mockReplace).toHaveBeenCalledWith('/properties?')
  })

  it('handleChange does not call replace for an areaCode update that results in empty', () => {
    const { result } = renderHook(() => usePropertyFilters())

    act(() => {
      result.current.handleChange('areaCodes', [])
    })

    // areaCodes=[] is filtered out → same as EMPTY_FILTERS → URL is /properties?
    const url = mockReplace.mock.calls[0][0] as string
    expect(url).toBe('/properties?')
  })
})
