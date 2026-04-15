import { useState, useEffect } from 'react'
import axios from 'axios'
import { PortfolioData } from '../types/portfolio'

export function usePortfolio() {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchData() {
    try {
      setLoading(true)
      const res = await axios.get<PortfolioData>('/api/portfolio')
      setData(res.data)
      setError(null)
    } catch (err) {
      setError('Failed to load portfolio data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData, setData }
}
