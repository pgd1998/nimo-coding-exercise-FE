import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import useCryptoData from './useCryptoData'
import coinGeckoApi, { searchCoinsByName } from '../services/coinGeckoAPI'

// Mock the API functions
vi.mock('../services/coinGeckoAPI', () => ({
  default: vi.fn(),
  searchCoinsByName: vi.fn()
}))

describe('useCryptoData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset console.error mock
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useCryptoData())
    
    expect(result.current.cryptoData).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe('')
    expect(typeof result.current.fetchCryptoData).toBe('function')
    expect(typeof result.current.searchCrypto).toBe('function')
    expect(typeof result.current.setCryptoData).toBe('function')
  })

  describe('fetchCryptoData', () => {
    it('should fetch crypto data successfully', async () => {
      const mockData = [
        { id: 'bitcoin', name: 'Bitcoin', current_price: 50000 },
        { id: 'ethereum', name: 'Ethereum', current_price: 3000 }
      ]
      
      coinGeckoApi.mockResolvedValueOnce(mockData)
      
      const { result } = renderHook(() => useCryptoData())
      
      await act(async () => {
        await result.current.fetchCryptoData({ page: 1 })
      })
      
      expect(coinGeckoApi).toHaveBeenCalledWith({ page: 1 })
      expect(result.current.cryptoData).toEqual(mockData)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isError).toBe('')
    })

    it('should set loading state correctly during fetch', async () => {
      coinGeckoApi.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve([]), 100))
      )
      
      const { result } = renderHook(() => useCryptoData())
      
      act(() => {
        result.current.fetchCryptoData()
      })
      
      expect(result.current.isLoading).toBe(true)
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should handle API returning null/undefined', async () => {
      coinGeckoApi.mockResolvedValueOnce(null)
      
      const { result } = renderHook(() => useCryptoData())
      
      await act(async () => {
        await result.current.fetchCryptoData()
      })
      
      expect(result.current.cryptoData).toEqual([])
      expect(result.current.isError).toBe("There was an error while fetching the crypto data")
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle API errors', async () => {
      const error = new Error('Network error')
      coinGeckoApi.mockRejectedValueOnce(error)
      
      const { result } = renderHook(() => useCryptoData())
      
      await act(async () => {
        await result.current.fetchCryptoData()
      })
      
      expect(result.current.cryptoData).toEqual([])
      expect(result.current.isError).toBe("Server error while fetching crypto data")
      expect(result.current.isLoading).toBe(false)
      expect(console.error).toHaveBeenCalledWith(error)
    })

    it('should call API with default empty params', async () => {
      coinGeckoApi.mockResolvedValueOnce([])
      
      const { result } = renderHook(() => useCryptoData())
      
      await act(async () => {
        await result.current.fetchCryptoData()
      })
      
      expect(coinGeckoApi).toHaveBeenCalledWith({})
    })
  })

  describe('searchCrypto', () => {
    it('should search crypto successfully', async () => {
      const searchResult = {
        coins: [
          { id: 'bitcoin', name: 'Bitcoin' },
          { id: 'ethereum', name: 'Ethereum' }
        ]
      }
      const cryptoData = [
        { id: 'bitcoin', name: 'Bitcoin', current_price: 50000 },
        { id: 'ethereum', name: 'Ethereum', current_price: 3000 }
      ]
      
      searchCoinsByName.mockResolvedValueOnce(searchResult)
      coinGeckoApi.mockResolvedValueOnce(cryptoData)
      
      const { result } = renderHook(() => useCryptoData())
      
      await act(async () => {
        await result.current.searchCrypto('bitcoin')
      })
      
      expect(searchCoinsByName).toHaveBeenCalledWith('bitcoin')
      expect(coinGeckoApi).toHaveBeenCalledWith({ ids: 'bitcoin,ethereum' })
      expect(result.current.cryptoData).toEqual(cryptoData)
      expect(result.current.isError).toBe('')
    })

    it('should limit search results to 20 coins', async () => {
      const manyCoins = Array.from({ length: 25 }, (_, i) => ({ 
        id: `coin${i}`, 
        name: `Coin ${i}` 
      }))
      const searchResult = { coins: manyCoins }
      
      searchCoinsByName.mockResolvedValueOnce(searchResult)
      coinGeckoApi.mockResolvedValueOnce([])
      
      const { result } = renderHook(() => useCryptoData())
      
      await act(async () => {
        await result.current.searchCrypto('test')
      })
      
      const expectedIds = manyCoins.slice(0, 20).map(coin => coin.id).join(',')
      expect(coinGeckoApi).toHaveBeenCalledWith({ ids: expectedIds })
    })

    it('should handle empty search results', async () => {
      const searchResult = { coins: [] }
      searchCoinsByName.mockResolvedValueOnce(searchResult)
      
      const { result } = renderHook(() => useCryptoData())
      
      await act(async () => {
        await result.current.searchCrypto('nonexistent')
      })
      
      expect(searchCoinsByName).toHaveBeenCalledWith('nonexistent')
      expect(coinGeckoApi).not.toHaveBeenCalled()
      expect(result.current.cryptoData).toEqual([])
      expect(result.current.isError).toBe('')
    })

    it('should handle search API errors', async () => {
      const error = new Error('Search failed')
      searchCoinsByName.mockRejectedValueOnce(error)
      
      const { result } = renderHook(() => useCryptoData())
      
      await act(async () => {
        await result.current.searchCrypto('bitcoin')
      })
      
      expect(result.current.cryptoData).toEqual([])
      expect(result.current.isError).toBe("Server error while searching crypto")
      expect(result.current.isLoading).toBe(false)
      expect(console.error).toHaveBeenCalledWith(error)
    })

    it('should handle undefined search result', async () => {
      searchCoinsByName.mockResolvedValueOnce(null)
      
      const { result } = renderHook(() => useCryptoData())
      
      await act(async () => {
        await result.current.searchCrypto('test')
      })
      
      expect(result.current.cryptoData).toEqual([])
      expect(result.current.isError).toBe('')
    })

    it('should handle coinGeckoApi returning null in search', async () => {
      const searchResult = {
        coins: [{ id: 'bitcoin', name: 'Bitcoin' }]
      }
      
      searchCoinsByName.mockResolvedValueOnce(searchResult)
      coinGeckoApi.mockResolvedValueOnce(null)
      
      const { result } = renderHook(() => useCryptoData())
      
      await act(async () => {
        await result.current.searchCrypto('bitcoin')
      })
      
      expect(result.current.cryptoData).toEqual([])
    })
  })

  describe('setCryptoData', () => {
    it('should allow direct setting of crypto data', () => {
      const { result } = renderHook(() => useCryptoData())
      const newData = [{ id: 'bitcoin', name: 'Bitcoin' }]
      
      act(() => {
        result.current.setCryptoData(newData)
      })
      
      expect(result.current.cryptoData).toEqual(newData)
    })
  })

  describe('error state management', () => {
    it('should clear previous errors when making new requests', async () => {
      // First, create an error state
      coinGeckoApi.mockRejectedValueOnce(new Error('First error'))
      const { result } = renderHook(() => useCryptoData())
      
      await act(async () => {
        await result.current.fetchCryptoData()
      })
      
      expect(result.current.isError).toBe("Server error while fetching crypto data")
      
      // Then make a successful request
      coinGeckoApi.mockResolvedValueOnce([{ id: 'bitcoin' }])
      
      await act(async () => {
        await result.current.fetchCryptoData()
      })
      
      expect(result.current.isError).toBe('')
    })
  })
})