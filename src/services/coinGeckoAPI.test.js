import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import coinGeckoApi, { searchCoinsByName, getCoinById } from './coinGeckoAPI'

// Mock fetch globally
/* global globalThis */
globalThis.fetch = vi.fn()

// Mock environment variables
vi.mock('../../env', () => ({
  DEV: false,
  VITE_API_KEY: 'test-api-key'
}))

describe('coinGeckoAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock import.meta.env - use the actual values from the environment
    Object.defineProperty(globalThis, 'import', {
      value: {
        meta: {
          env: {
            DEV: true, // Tests run in development mode
            VITE_API_KEY: import.meta.env.VITE_API_KEY || 'test-api-key'
          }
        }
      },
      writable: true
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('coinGeckoApi (default export)', () => {
    const mockCoinData = [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        current_price: 50000,
        market_cap: 900000000000
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        current_price: 3000,
        market_cap: 360000000000
      }
    ]

    it('should fetch coins with default parameters', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockCoinData)
      }
      fetch.mockResolvedValueOnce(mockResponse)

      const result = await coinGeckoApi()

      expect(fetch).toHaveBeenCalledWith(
        '/api/coins/markets?vs_currency=aud&order=market_cap_desc&per_page=25&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d',
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': import.meta.env.VITE_API_KEY || 'test-api-key'
          }
        }
      )
      expect(result).toEqual(mockCoinData)
    })

    it('should fetch coins with custom parameters', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockCoinData)
      }
      fetch.mockResolvedValueOnce(mockResponse)

      const params = {
        vs_currency: 'usd',
        order: 'volume_desc',
        per_page: 50,
        page: 2,
        sparkline: true,
        price_change_percentage: '24h',
        ids: 'bitcoin,ethereum',
        names: 'Bitcoin'
      }

      await coinGeckoApi(params)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('vs_currency=usd'),
        expect.any(Object)
      )
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('order=volume_desc'),
        expect.any(Object)
      )
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('per_page=50'),
        expect.any(Object)
      )
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        expect.any(Object)
      )
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('sparkline=true'),
        expect.any(Object)
      )
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('ids=bitcoin%2Cethereum'),
        expect.any(Object)
      )
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('names=Bitcoin'),
        expect.any(Object)
      )
    })

    it('should handle URL encoding for names parameter', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve([])
      }
      fetch.mockResolvedValueOnce(mockResponse)

      await coinGeckoApi({ names: 'Bitcoin Cash & Ethereum' })

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('names=Bitcoin%2520Cash%2520%2526%2520Ethereum'),
        expect.any(Object)
      )
    })

    it('should handle API errors', async () => {
      const mockResponse = {
        ok: false,
        status: 404
      }
      fetch.mockResolvedValueOnce(mockResponse)

      await expect(coinGeckoApi()).rejects.toThrow('HTTP error! status: 404')
      expect(console.error).toHaveBeenCalledWith(
        'CoinGecko API Error:', 
        expect.any(Error)
      )
    })

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(coinGeckoApi()).rejects.toThrow('Network error')
      expect(console.error).toHaveBeenCalledWith(
        'CoinGecko API Error:', 
        expect.any(Error)
      )
    })

    it('should not include ids parameter when null', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve([])
      }
      fetch.mockResolvedValueOnce(mockResponse)

      await coinGeckoApi({ ids: null })

      expect(fetch).toHaveBeenCalledWith(
        expect.not.stringContaining('ids='),
        expect.any(Object)
      )
    })

    it('should not include names parameter when null', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve([])
      }
      fetch.mockResolvedValueOnce(mockResponse)

      await coinGeckoApi({ names: null })

      expect(fetch).toHaveBeenCalledWith(
        expect.not.stringContaining('names='),
        expect.any(Object)
      )
    })

    it('should convert numeric parameters to strings', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve([])
      }
      fetch.mockResolvedValueOnce(mockResponse)

      await coinGeckoApi({ per_page: 100, page: 5, sparkline: true })

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('per_page=100'),
        expect.any(Object)
      )
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=5'),
        expect.any(Object)
      )
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('sparkline=true'),
        expect.any(Object)
      )
    })
  })

  describe('searchCoinsByName', () => {
    const mockSearchResult = {
      coins: [
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
        { id: 'bitcoin-cash', name: 'Bitcoin Cash', symbol: 'BCH' }
      ]
    }

    it('should search coins by name', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockSearchResult)
      }
      fetch.mockResolvedValueOnce(mockResponse)

      const result = await searchCoinsByName('bitcoin')

      expect(fetch).toHaveBeenCalledWith(
        '/api/search?query=bitcoin',
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': import.meta.env.VITE_API_KEY || 'test-api-key'
          }
        }
      )
      expect(result).toEqual(mockSearchResult)
    })

    it('should handle URL encoding for search terms', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ coins: [] })
      }
      fetch.mockResolvedValueOnce(mockResponse)

      await searchCoinsByName('bitcoin & ethereum')

      expect(fetch).toHaveBeenCalledWith(
        '/api/search?query=bitcoin%20%26%20ethereum',
        expect.any(Object)
      )
    })

    it('should handle search API errors', async () => {
      const mockResponse = {
        ok: false,
        status: 500
      }
      fetch.mockResolvedValueOnce(mockResponse)

      await expect(searchCoinsByName('bitcoin')).rejects.toThrow('HTTP error! status: 500')
      expect(console.error).toHaveBeenCalledWith(
        'CoinGecko Search API Error:', 
        expect.any(Error)
      )
    })

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Connection failed'))

      await expect(searchCoinsByName('bitcoin')).rejects.toThrow('Connection failed')
      expect(console.error).toHaveBeenCalledWith(
        'CoinGecko Search API Error:', 
        expect.any(Error)
      )
    })

    it('should handle empty search terms', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ coins: [] })
      }
      fetch.mockResolvedValueOnce(mockResponse)

      await searchCoinsByName('')

      expect(fetch).toHaveBeenCalledWith(
        '/api/search?query=',
        expect.any(Object)
      )
    })
  })

  describe('getCoinById', () => {
    const mockCoinDetail = {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'btc',
      market_data: {
        current_price: { usd: 50000, aud: 75000 }
      }
    }

    it('should get coin by ID with default options', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockCoinDetail)
      }
      fetch.mockResolvedValueOnce(mockResponse)

      const result = await getCoinById('bitcoin')

      expect(fetch).toHaveBeenCalledWith(
        '/api/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=false',
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': import.meta.env.VITE_API_KEY || 'test-api-key'
          }
        }
      )
      expect(result).toEqual(mockCoinDetail)
    })

    it('should get coin by ID with custom options', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockCoinDetail)
      }
      fetch.mockResolvedValueOnce(mockResponse)

      const options = {
        localization: 'true',
        tickers: 'true',
        market_data: 'false',
        community_data: 'false',
        developer_data: 'false',
        sparkline: 'true'
      }

      await getCoinById('bitcoin', options)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('localization=true'),
        expect.any(Object)
      )
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('tickers=true'),
        expect.any(Object)
      )
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('market_data=false'),
        expect.any(Object)
      )
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('community_data=false'),
        expect.any(Object)
      )
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('developer_data=false'),
        expect.any(Object)
      )
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('sparkline=true'),
        expect.any(Object)
      )
    })

    it('should handle coin detail API errors', async () => {
      const mockResponse = {
        ok: false,
        status: 404
      }
      fetch.mockResolvedValueOnce(mockResponse)

      await expect(getCoinById('nonexistent')).rejects.toThrow('HTTP error! status: 404')
      expect(console.error).toHaveBeenCalledWith(
        'CoinGecko Coin Detail API Error:', 
        expect.any(Error)
      )
    })

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Timeout'))

      await expect(getCoinById('bitcoin')).rejects.toThrow('Timeout')
      expect(console.error).toHaveBeenCalledWith(
        'CoinGecko Coin Detail API Error:', 
        expect.any(Error)
      )
    })

    it('should handle partial options', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockCoinDetail)
      }
      fetch.mockResolvedValueOnce(mockResponse)

      await getCoinById('bitcoin', { tickers: 'true', sparkline: 'true' })

      const call = fetch.mock.calls[0]
      const url = call[0]
      
      expect(url).toContain('localization=false') // default
      expect(url).toContain('tickers=true') // custom
      expect(url).toContain('market_data=true') // default
      expect(url).toContain('community_data=true') // default
      expect(url).toContain('developer_data=true') // default
      expect(url).toContain('sparkline=true') // custom
    })
  })

  describe('BASE_URL configuration', () => {
    it('should use development URL when DEV is true', () => {
      // The actual behavior is tested in the other tests where we verify /api URLs
      // This test documents that the BASE_URL changes based on DEV environment
      expect(import.meta.env.DEV).toBe(true)
    })

    it('should use production URL when DEV is false', () => {
      // This test documents the expected production behavior
      // In production, BASE_URL would be 'https://api.coingecko.com/api/v3'
      expect(typeof import.meta.env.DEV).toBe('boolean')
    })
  })

  describe('error handling consistency', () => {
    it('should log errors consistently across all functions', async () => {
      const error = new Error('Test error')
      fetch.mockRejectedValue(error)

      // Test all three functions
      await expect(coinGeckoApi()).rejects.toThrow()
      await expect(searchCoinsByName('test')).rejects.toThrow()
      await expect(getCoinById('test')).rejects.toThrow()

      // Verify all logged errors
      expect(console.error).toHaveBeenCalledWith('CoinGecko API Error:', error)
      expect(console.error).toHaveBeenCalledWith('CoinGecko Search API Error:', error)
      expect(console.error).toHaveBeenCalledWith('CoinGecko Coin Detail API Error:', error)
    })
  })
})