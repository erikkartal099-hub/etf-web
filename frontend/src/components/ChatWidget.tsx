// AI Chat Widget - Sora Assistant
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export default function ChatWidget() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Sora, your AI assistant for CoinDesk Crypto 5 ETF. How can I help you today? 😊",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // n8n webhook configuration (env configurable with a safe fallback)
  const N8N_WEBHOOK =
    import.meta.env.VITE_N8N_SORA_WEBHOOK ||
    'https://n8n.odia.dev/webhook/7ea0ea7f-d542-4f94-ba78-c496b762abf2'

  // Send user message to n8n webhook and await assistant reply
  async function requestAssistantReply(payload: Record<string, any>) {
    if (!N8N_WEBHOOK) throw new Error('Webhook URL not configured')
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    try {
      const res = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      if (!res.ok) throw new Error(`Webhook error ${res.status}`)
      const text = await res.text()
      // Try JSON first; fallback to plain text
      try {
        const json = JSON.parse(text)
        return json
      } catch {
        return { message: text }
      }
    } finally {
      clearTimeout(timeout)
    }
  }

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  // No remote history fetch; keep chat session local and ephemeral

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Send to n8n webhook and expect a response
      const resp = await requestAssistantReply({
        source: 'sora-widget',
        event: 'chat',
        userId: user?.id || null,
        sessionId,
        message: userMessage.content,
        history: messages,
        path: window.location.pathname,
        origin: window.location.origin,
      })

      const assistantMessage: Message = {
        role: 'assistant',
        content:
          resp?.message ||
          resp?.reply ||
          resp?.text ||
          "I'm having trouble responding right now.",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('Chat error:', error)
      toast.error('Failed to send message. Please try again.')
      
      // Add fallback message
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again in a moment! 🙏",
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-primary rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          
          {/* Tooltip */}
          <span className="absolute right-16 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat with Sora 💬
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-gradient-primary p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold">Sora</div>
                <div className="text-white/80 text-xs">AI Assistant</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {formatDate(message.timestamp, 'relative')}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Sora is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Sora anything..."
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                maxLength={500}
              />
              <button
                onClick={(e) => handleSubmit(e as any)}
                disabled={!input.trim() || loading}
                className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Powered by Groq (Llama 3.1) • {user ? 'Signed in' : 'Guest mode'}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
