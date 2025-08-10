import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import useCoinDetail from './useCoinDetail'
import { getCoinById } from '../services/coinGeckoAPI'

// Mock the API function
vi.mock('../services/coinGeckoAPI', () => ({
  getCoinById: vi.fn()
}))

describe('useCoinDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset console.error mock
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useCoinDetail())
    
    expect(result.current.coinDetail).toBe(null)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe('')
    expect(typeof result.current.fetchCoinDetail).toBe('function')
    expect(typeof result.current.clearCoinDetail).toBe('function')
  })

  describe('fetchCoinDetail', () => {
    it('should fetch coin detail successfully', async () => {
      const mockCoinData = {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'btc',
        market_data: {
          current_price: { usd: 50000 }
        }
      }
      
      getCoinById.mockResolvedValueOnce(mockCoinData)
      
      const { result } = renderHook(() => useCoinDetail())
      let returnedData
      
      await act(async () => {
        returnedData = await result.current.fetchCoinDetail('bitcoin')
      })
      
      expect(getCoinById).toHaveBeenCalledWith('bitcoin', {})
      expect(result.current.coinDetail).toEqual(mockCoinData)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isError).toBe('')
      expect(returnedData).toEqual(mockCoinData)
    })

    it('should pass options to API call', async () => {
      const mockCoinData = { id: 'bitcoin' }
      const options = { localization: false, tickers: false }
      
      getCoinById.mockResolvedValueOnce(mockCoinData)
      
      const { result } = renderHook(() => useCoinDetail())
      
      await act(async () => {
        await result.current.fetchCoinDetail('bitcoin', options)
      })
      
      expect(getCoinById).toHaveBeenCalledWith('bitcoin', options)
    })

    it('should set loading state correctly during fetch', async () => {
      getCoinById.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ id: 'bitcoin' }), 100))
      )
      
      const { result } = renderHook(() => useCoinDetail())
      
      act(() => {
        result.current.fetchCoinDetail('bitcoin')
      })
      
      expect(result.current.isLoading).toBe(true)
      expect(result.current.coinDetail).toBe(null) // Should clear previous data
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should handle API returning null/undefined', async () => {
      getCoinById.mockResolvedValueOnce(null)
      
      const { result } = renderHook(() => useCoinDetail())
      let returnedData
      
      await act(async () => {
        returnedData = await result.current.fetchCoinDetail('bitcoin')
      })
      
      expect(result.current.coinDetail).toBe(null)
      expect(result.current.isError).toBe("Could not fetch cryptocurrency details")
      expect(result.current.isLoading).toBe(false)
      expect(returnedData).toBe(null)
    })

    it('should handle API errors', async () => {
      const error = new Error('Network error')
      getCoinById.mockRejectedValueOnce(error)
      
      const { result } = renderHook(() => useCoinDetail())
      let returnedData
      
      await act(async () => {
        returnedData = await result.current.fetchCoinDetail('bitcoin')
      })
      
      expect(result.current.coinDetail).toBe(null)
      expect(result.current.isError).toBe("Error fetching cryptocurrency details")
      expect(result.current.isLoading).toBe(false)
      expect(console.error).toHaveBeenCalledWith(error)
      expect(returnedData).toBe(null)
    })

    it('should clear previous data and error when starting new fetch', async () => {
      // First, set some initial state
      const { result } = renderHook(() => useCoinDetail())
      
      // Mock error first
      getCoinById.mockRejectedValueOnce(new Error('First error'))
      
      await act(async () => {
        await result.current.fetchCoinDetail('bitcoin')
      })
      
      expect(result.current.isError).toBe("Error fetching cryptocurrency details")
      
      // Now mock successful response
      const newMockData = { id: 'ethereum', name: 'Ethereum' }
      getCoinById.mockResolvedValueOnce(newMockData)
      
      await act(async () => {
        await result.current.fetchCoinDetail('ethereum')
      })
      
      expect(result.current.coinDetail).toEqual(newMockData)
      expect(result.current.isError).toBe('')
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle default empty options', async () => {
      const mockCoinData = { id: 'bitcoin' }
      getCoinById.mockResolvedValueOnce(mockCoinData)
      
      const { result } = renderHook(() => useCoinDetail())
      
      await act(async () => {
        await result.current.fetchCoinDetail('bitcoin')
      })
      
      expect(getCoinById).toHaveBeenCalledWith('bitcoin', {})
    })
  })

  describe('clearCoinDetail', () => {
    it('should clear coin detail and reset state', async () => {
      const mockCoinData = { id: 'bitcoin', name: 'Bitcoin' }
      getCoinById.mockResolvedValueOnce(mockCoinData)
      
      const { result } = renderHook(() => useCoinDetail())
      
      // First fetch some data
      await act(async () => {
        await result.current.fetchCoinDetail('bitcoin')
      })
      
      expect(result.current.coinDetail).toEqual(mockCoinData)
      
      // Then clear it
      act(() => {
        result.current.clearCoinDetail()
      })
      
      expect(result.current.coinDetail).toBe(null)
      expect(result.current.isError).toBe('')
      expect(result.current.isLoading).toBe(false)
    })

    it('should clear error state', async () => {
      const { result } = renderHook(() => useCoinDetail())
      
      // First create an error state
      getCoinById.mockRejectedValueOnce(new Error('Test error'))
      
      await act(async () => {
        await result.current.fetchCoinDetail('bitcoin')
      })
      
      expect(result.current.isError).toBe("Error fetching cryptocurrency details")
      
      // Then clear it
      act(() => {
        result.current.clearCoinDetail()
      })
      
      expect(result.current.coinDetail).toBe(null)
      expect(result.current.isError).toBe('')
      expect(result.current.isLoading).toBe(false)
    })

    it('should clear loading state', async () => {
      const { result } = renderHook(() => useCoinDetail())
      
      // Manually set loading state (shouldn't normally happen but test edge case)
      act(() => {
        result.current.clearCoinDetail()
      })
      
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('state transitions', () => {
    it('should handle multiple concurrent requests correctly', async () => {
      const { result } = renderHook(() => useCoinDetail())
      
      // Mock different responses for different calls
      getCoinById
        .mockResolvedValueOnce({ id: 'bitcoin', name: 'Bitcoin' })
        .mockResolvedValueOnce({ id: 'ethereum', name: 'Ethereum' })
      
      // Start two requests
      let result1, result2
      await act(async () => {
        const promise1 = result.current.fetchCoinDetail('bitcoin')
        const promise2 = result.current.fetchCoinDetail('ethereum') // This should clear the first one
        
        await promise1
        await promise2
      })
      
      // The last request should win
      expect(result.current.coinDetail).toEqual({ id: 'ethereum', name: 'Ethereum' })
      expect(result.current.isError).toBe('')
      expect(result.current.isLoading).toBe(false)
    })
  })
})