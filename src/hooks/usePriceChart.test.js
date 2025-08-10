import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import usePriceChart from './usePriceChart'

// Mock fetch globally
/* global globalThis */
globalThis.fetch = vi.fn()

describe('usePriceChart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset console methods
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => usePriceChart())
    
    expect(result.current.chartData).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(null)
    expect(result.current.days).toBe(7)
    expect(typeof result.current.setDays).toBe('function')
    expect(typeof result.current.fetchChartData).toBe('function')
  })

  describe('fetchChartData', () => {
    const mockChartResponse = {
      prices: [
        [1640995200000, 47686.24],
        [1641081600000, 46456.78],
        [1641168000000, 48234.12]
      ],
      market_caps: [
        [1640995200000, 902345678900],
        [1641081600000, 879876543210],
        [1641168000000, 912345678900]
      ],
      total_volumes: [
        [1640995200000, 32456789000],
        [1641081600000, 28765432100],
        [1641168000000, 35678901234]
      ]
    }

    it('should fetch chart data successfully via direct request', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockChartResponse)
      }
      fetch.mockResolvedValueOnce(mockResponse)
      
      const { result } = renderHook(() => usePriceChart())
      
      await act(async () => {
        await result.current.fetchChartData('bitcoin', 7, 'usd')
      })
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7&interval=daily'
      )
      expect(result.current.chartData).toHaveLength(3)
      expect(result.current.chartData[0]).toMatchObject({
        timestamp: 1640995200000,
        price: 47686.24,
        volume: 32456789000,
        marketCap: 902345678900
      })
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isError).toBe(null)
    })

    it('should fallback to proxy when direct request fails', async () => {
      // First call (direct) fails
      fetch.mockRejectedValueOnce(new Error('Direct request failed'))
      
      // Second call (proxy) succeeds
      const proxyResponse = {
        ok: true,
        json: () => Promise.resolve({
          contents: JSON.stringify(mockChartResponse)
        })
      }
      fetch.mockResolvedValueOnce(proxyResponse)
      
      const { result } = renderHook(() => usePriceChart())
      
      await act(async () => {
        await result.current.fetchChartData('bitcoin', 7, 'usd')
      })
      
      expect(fetch).toHaveBeenCalledTimes(2)
      expect(fetch).toHaveBeenNthCalledWith(1, 
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7&interval=daily'
      )
      expect(fetch).toHaveBeenNthCalledWith(2,
        'https://api.allorigins.win/get?url=https%3A%2F%2Fapi.coingecko.com%2Fapi%2Fv3%2Fcoins%2Fbitcoin%2Fmarket_chart%3Fvs_currency%3Dusd%26days%3D7%26interval%3Ddaily',
        expect.objectContaining({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
      )
      
      expect(result.current.chartData).toHaveLength(3)
      expect(result.current.isError).toBe(null)
    })

    it('should handle hourly interval for 1 day requests', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockChartResponse)
      }
      fetch.mockResolvedValueOnce(mockResponse)
      
      const { result } = renderHook(() => usePriceChart())
      
      await act(async () => {
        await result.current.fetchChartData('bitcoin', 1, 'usd')
      })
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1&interval=hourly'
      )
    })

    it('should handle daily interval for multi-day requests', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockChartResponse)
      }
      fetch.mockResolvedValueOnce(mockResponse)
      
      const { result } = renderHook(() => usePriceChart())
      
      await act(async () => {
        await result.current.fetchChartData('bitcoin', 30, 'usd')
      })
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily'
      )
    })

    it('should use default parameters', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockChartResponse)
      }
      fetch.mockResolvedValueOnce(mockResponse)
      
      const { result } = renderHook(() => usePriceChart())
      
      await act(async () => {
        await result.current.fetchChartData('bitcoin')
      })
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=aud&days=7&interval=daily'
      )
    })

    it('should return early if no coinId provided', async () => {
      const { result } = renderHook(() => usePriceChart())
      
      await act(async () => {
        await result.current.fetchChartData('')
      })
      
      expect(fetch).not.toHaveBeenCalled()
    })

    it('should set loading state correctly', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockChartResponse)
      }
      fetch.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
      )
      
      const { result } = renderHook(() => usePriceChart())
      
      act(() => {
        result.current.fetchChartData('bitcoin')
      })
      
      expect(result.current.isLoading).toBe(true)
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should handle empty price data', async () => {
      const emptyResponse = { prices: [] }
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(emptyResponse)
      }
      fetch.mockResolvedValueOnce(mockResponse)
      
      const { result } = renderHook(() => usePriceChart())
      
      await act(async () => {
        await result.current.fetchChartData('bitcoin', 7)
      })
      
      expect(result.current.chartData).toEqual([])
      expect(result.current.isError).toMatch(/No price data available for 7 days/)
    })

    it('should handle missing price data', async () => {
      const invalidResponse = {}
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(invalidResponse)
      }
      fetch.mockResolvedValueOnce(mockResponse)
      
      const { result } = renderHook(() => usePriceChart())
      
      await act(async () => {
        await result.current.fetchChartData('bitcoin', 1)
      })
      
      expect(result.current.isError).toMatch(/No price data available for 1 day/)
    })

    it('should filter out invalid price data', async () => {
      const mixedDataResponse = {
        prices: [
          [1640995200000, 47686.24], // valid
          [1641081600000, 0], // invalid (zero price)
          [1641168000000, NaN], // invalid (NaN)
          [1641254400000, Infinity], // invalid (Infinity)
          [1641340800000, 48234.12] // valid
        ]
      }
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mixedDataResponse)
      }
      fetch.mockResolvedValueOnce(mockResponse)
      
      const { result } = renderHook(() => usePriceChart())
      
      await act(async () => {
        await result.current.fetchChartData('bitcoin', 7)
      })
      
      expect(result.current.chartData).toHaveLength(2) // Only valid data points
      expect(result.current.chartData[0].price).toBe(47686.24)
      expect(result.current.chartData[1].price).toBe(48234.12)
    })

    it('should handle all invalid data points', async () => {
      const invalidDataResponse = {
        prices: [
          [1640995200000, 0],
          [1641081600000, NaN],
          [1641168000000, Infinity]
        ]
      }
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(invalidDataResponse)
      }
      fetch.mockResolvedValueOnce(mockResponse)
      
      const { result } = renderHook(() => usePriceChart())
      
      await act(async () => {
        await result.current.fetchChartData('bitcoin', 7)
      })
      
      expect(result.current.chartData).toEqual([])
      expect(result.current.isError).toMatch(/No valid price data found for 7 days/)
    })

    it('should handle network errors', async () => {
      fetch.mockRejectedValue(new Error('Failed to fetch'))
      
      const { result } = renderHook(() => usePriceChart())
      
      await act(async () => {
        await result.current.fetchChartData('bitcoin')
      })
      
      expect(result.current.chartData).toEqual([])
      expect(result.current.isError).toBe('Unable to fetch chart data. Please check your internet connection.')
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle proxy request failures', async () => {
      // Direct request fails
      fetch.mockRejectedValueOnce(new Error('Direct failed'))
      
      // Proxy request also fails
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })
      
      const { result } = renderHook(() => usePriceChart())
      
      await act(async () => {
        await result.current.fetchChartData('bitcoin')
      })
      
      expect(result.current.isError).toMatch(/Proxy request failed. Status: 500/)
      expect(result.current.chartData).toEqual([])
    })

    it('should format data correctly with all fields', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockChartResponse)
      }
      fetch.mockResolvedValueOnce(mockResponse)
      
      const { result } = renderHook(() => usePriceChart())
      
      await act(async () => {
        await result.current.fetchChartData('bitcoin')
      })
      
      const dataPoint = result.current.chartData[0]
      expect(dataPoint).toMatchObject({
        timestamp: expect.any(Number),
        date: expect.any(String),
        time: expect.any(String),
        price: expect.any(Number),
        volume: expect.any(Number),
        marketCap: expect.any(Number)
      })
    })

    it('should handle missing volume/market cap data gracefully', async () => {
      const partialDataResponse = {
        prices: [[1640995200000, 47686.24]]
        // No market_caps or total_volumes
      }
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(partialDataResponse)
      }
      fetch.mockResolvedValueOnce(mockResponse)
      
      const { result } = renderHook(() => usePriceChart())
      
      await act(async () => {
        await result.current.fetchChartData('bitcoin')
      })
      
      const dataPoint = result.current.chartData[0]
      expect(dataPoint.volume).toBe(0)
      expect(dataPoint.marketCap).toBe(0)
    })

    it('should clear error state on successful request', async () => {
      const { result } = renderHook(() => usePriceChart())
      
      // First request fails
      fetch.mockRejectedValueOnce(new Error('Network error'))
      
      await act(async () => {
        await result.current.fetchChartData('bitcoin')
      })
      
      expect(result.current.isError).toBeTruthy()
      
      // Second request succeeds
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockChartResponse)
      }
      fetch.mockResolvedValueOnce(mockResponse)
      
      await act(async () => {
        await result.current.fetchChartData('bitcoin')
      })
      
      expect(result.current.isError).toBe(null)
    })
  })

  describe('setDays', () => {
    it('should update days state', () => {
      const { result } = renderHook(() => usePriceChart())
      
      act(() => {
        result.current.setDays(30)
      })
      
      expect(result.current.days).toBe(30)
    })
  })
})