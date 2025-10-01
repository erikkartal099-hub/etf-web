import { useEffect, useRef, memo } from 'react'

interface TradingViewChartProps {
  symbol?: string
  interval?: string
  theme?: 'light' | 'dark'
  height?: number
  width?: string | number
  autosize?: boolean
  studies?: string[]
  showToolbar?: boolean
}

/**
 * TradingView Advanced Chart Widget
 * 
 * Features:
 * - Real-time crypto price charts with technical indicators
 * - RSI, MACD, Volume, Moving Averages
 * - Multiple timeframes (1m, 5m, 15m, 1h, 4h, 1D, 1W)
 * - Drawing tools and analysis
 * 
 * Integration: Free embed (no API key required for basic features)
 * Upgrade path: TradingView Premium for advanced features ($14.95/mo)
 */
function TradingViewChart({
  symbol = 'BINANCE:BTCUSDT',
  interval = 'D',
  theme = 'dark',
  height = 500,
  width = '100%',
  autosize = true,
  studies = ['RSI@tv-basicstudies', 'MACD@tv-basicstudies'],
  showToolbar = true,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clear existing widget
    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined') {
        new window.TradingView.widget({
          autosize: autosize,
          width: autosize ? '100%' : width,
          height: height,
          symbol: symbol,
          interval: interval,
          timezone: 'Etc/UTC',
          theme: theme,
          style: '1',
          locale: 'en',
          toolbar_bg: theme === 'dark' ? '#1a1a1a' : '#f1f3f6',
          enable_publishing: false,
          hide_side_toolbar: !showToolbar,
          allow_symbol_change: true,
          studies: studies,
          container_id: containerRef.current?.id || 'tradingview_chart',
          // Advanced features
          details: true,
          hotlist: true,
          calendar: false,
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
          // Indicators and overlays
          disabled_features: [],
          enabled_features: [
            'study_templates',
            'use_localstorage_for_settings',
            'save_chart_properties_to_local_storage',
          ],
        })
      }
    }

    containerRef.current.appendChild(script)

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [symbol, interval, theme, height, width, autosize, studies, showToolbar])

  return (
    <div
      ref={containerRef}
      id="tradingview_chart"
      className="tradingview-widget-container"
      style={{ height: autosize ? '100%' : height }}
    />
  )
}

export default memo(TradingViewChart)

// Type declaration for TradingView widget
declare global {
  interface Window {
    TradingView: any
  }
}
