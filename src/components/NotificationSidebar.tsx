import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../lib/api'
import { Bell, X, Check, Trash2 } from 'lucide-react'

interface Notification {
  id: string
  type: 'liked' | 'featured' | 'connected' | 'product_updated' | 'info'
  message: string
  actor?: { name: string }
  data?: any
  read: boolean
  createdAt: string
}

export function NotificationSidebar() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadNotifications()
    const interval = setInterval(loadNotifications, 10000) // Poll every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const loadNotifications = async () => {
    try {
      setIsLoading(true)
      const data = await api<any[]>('/api/notifications/me')
      // Transform backend notifications to frontend format
      const transformed = data.map((n: any) => ({
        id: n._id || n.id,
        type: n.type,
        message: getNotificationMessage(n),
        actor: { name: n.actorName || 'Someone' },
        data: n.data,
        read: n.read,
        createdAt: n.createdAt,
      }))
      setNotifications(transformed)
    } catch (err) {
      console.error('Failed to load notifications', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getNotificationMessage = (notif: any): string => {
    switch (notif.type) {
      case 'liked':
        return `Someone liked "${notif.data?.title || 'your product'}"`
      case 'featured':
        return `"${notif.data?.title || 'Your product'}" is now featured`
      case 'connected':
        return `A buyer connected with "${notif.data?.title || 'your product'}"`
      case 'product_updated':
        return `Your product "${notif.data?.title || 'listing'}" was updated`
      default:
        return notif.data?.message || 'New notification'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'liked':
        return '❤️'
      case 'featured':
        return '⭐'
      case 'connected':
        return '🔗'
      case 'product_updated':
        return '🔄'
      default:
        return '📌'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'liked':
        return 'bg-red-50 border-red-200 text-red-600'
      case 'featured':
        return 'bg-amber-50 border-amber-200 text-amber-600'
      case 'connected':
        return 'bg-blue-50 border-blue-200 text-blue-600'
      case 'product_updated':
        return 'bg-purple-50 border-purple-200 text-purple-600'
      default:
        return 'bg-slate-50 border-slate-200 text-slate-600'
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await api(`/api/notifications/${id}/read`, { method: 'POST' })
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
    } catch (err) {
      console.error('Failed to mark as read', err)
    }
  }

  const deleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString()
  }

  return (
    <>
      {/* Floating Notification Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 h-14 w-14 bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="border-b border-slate-200 p-6 flex items-center justify-between bg-gradient-to-r from-sky-50 to-slate-50">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Notifications</h2>
                  {unreadCount > 0 && (
                    <p className="text-xs text-sky-600 font-semibold mt-1">
                      {unreadCount} unread
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-slate-600" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {isLoading && notifications.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin text-4xl mb-4">⏳</div>
                      <p className="text-slate-500">Loading notifications...</p>
                    </div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center px-6">
                      <div className="text-4xl mb-4">📭</div>
                      <p className="text-slate-500 font-medium">No notifications yet</p>
                      <p className="text-xs text-slate-400 mt-2">
                        You'll see updates about your products here
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    <AnimatePresence>
                      {notifications.map((notif) => (
                        <motion.div
                          key={notif.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 100 }}
                          className={`p-4 rounded-2xl border-2 transition-all ${getNotificationColor(
                            notif.type
                          )} ${!notif.read ? 'ring-2 ring-offset-2 ring-offset-slate-50 ring-sky-400' : ''}`}
                        >
                          <div className="flex gap-3">
                            <span className="text-2xl flex-shrink-0">
                              {getNotificationIcon(notif.type)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm">{notif.message}</p>
                              <p className="text-xs opacity-75 mt-1">
                                {formatTime(notif.createdAt)}
                              </p>
                            </div>
                            {!notif.read && (
                              <button
                                onClick={() => markAsRead(notif.id)}
                                className="p-1 opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
                                title="Mark as read"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notif.id)}
                              className="p-1 opacity-60 hover:opacity-100 hover:text-red-600 transition-all flex-shrink-0"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-slate-200 p-4 bg-slate-50 flex gap-2">
                  <button
                    onClick={() => {
                      api('/api/notifications/mark-all-read', { method: 'POST' })
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
                    }}
                    className="flex-1 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Mark all read
                  </button>
                  <button
                    onClick={loadNotifications}
                    className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
