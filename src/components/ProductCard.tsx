import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageSquare, Phone, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../providers/AuthProvider'
import { useToast } from './Toast'
import { api, getImageUrl } from '../lib/api'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
  onLike: (id: string, liked: boolean) => void
  isLiked: boolean
}

export function ProductCard({ product, onLike, isLiked }: ProductCardProps) {
  const { user } = useAuth()
  const { show } = useToast()
  const [isLoadingLike, setIsLoadingLike] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [connectingWith, setConnectingWith] = useState<'whatsapp' | 'email' | null>(null)
  const [connectStage, setConnectStage] = useState<'selecting' | 'loading' | 'success'>('selecting')

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      show('Please log in to like products', 'info')
      return
    }

    try {
      setIsLoadingLike(true)
      const response = await api<{ product: Product; liked: boolean }>(
        `/api/products/${product.id}/like`,
        { method: 'POST' }
      )
      onLike(product.id, response.liked)
      show(response.liked ? 'Product liked!' : 'Like removed', 'success')
    } catch (err: any) {
      show(err.message || 'Failed to update like', 'error')
    } finally {
      setIsLoadingLike(false)
    }
  }

  const handleConnect = (method: 'whatsapp' | 'email') => {
    setConnectingWith(method)
    setConnectStage('loading')

    // Simulate 1 second delay then show success
    setTimeout(() => {
      setConnectStage('success')
      
      // Auto-open contact method
      if (method === 'whatsapp' && product.contact?.phone) {
        const msg = `Hi, I'm interested in "${product.title}"`
        const url = `https://wa.me/${product.contact.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(msg)}`
        window.open(url, '_blank')
      } else if (method === 'email' && product.contact?.email) {
        const subject = `Inquiry about: ${product.title}`
        const body = `Hi ${product.seller?.name || 'Seller'},\n\nI'm interested in your product: ${product.title}\n\nPrice: $${product.price}\n\nPlease provide more details.`
        window.open(`mailto:${product.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
      }

      // Close after 2 seconds
      setTimeout(() => {
        setShowConnectModal(false)
        setConnectStage('selecting')
        setConnectingWith(null)
        show('Connected! Check your message app', 'success')
      }, 2000)
    }, 1000)
  }

  const hasPhone = !!product.contact?.phone
  const hasEmail = !!product.contact?.email

  return (
    <>
      <motion.div
        className="h-full bg-white rounded border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
        whileHover={{ y: -2 }}
      >
        {/* Product Image - No Border Radius */}
        <div className="h-48 w-full bg-slate-100 overflow-hidden relative group">
          {product.images && product.images.length > 0 ? (
            <motion.img
              src={getImageUrl(product.images[0].url)}
              alt={product.title}
              className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image'
              }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <div className="text-center">
                <div className="text-4xl mb-2">📦</div>
                <p className="text-xs text-slate-500">No image</p>
              </div>
            </div>
          )}
        </div>

        {/* Product Content */}
        <div className="flex-1 p-4 flex flex-col gap-3">
          {/* Title */}
          <div>
            <h3 className="font-bold text-slate-900 line-clamp-2 text-sm">
              {product.title}
            </h3>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-xs text-slate-600 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">
              FRw {Number(product.price || 0).toLocaleString()}
            </span>
          </div>

          {/* Like Count */}
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
            <Heart className="h-3.5 w-3.5" fill="currentColor" />
            {product.likes || 0} {product.likes === 1 ? 'like' : 'likes'}
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100 my-1" />

          {/* Seller Info */}
          <div className="space-y-2 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Seller</p>
              <p className="text-slate-900 font-semibold">
                {product.seller?.name || 'Unknown Seller'}
              </p>
            </div>
            {product.contact?.phone && (
              <div>
                <p className="text-slate-400 font-medium flex items-center gap-1">
                  <Phone className="h-3 w-3" /> Phone
                </p>
                <p className="text-slate-900 font-mono text-xs">
                  {product.contact.phone}
                </p>
              </div>
            )}
            {product.seller?.location && (
              <div>
                <p className="text-slate-400 font-medium">📍 Location</p>
                <p className="text-slate-900 font-semibold">
                  {product.seller.location}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <button
            onClick={() => setShowConnectModal(true)}
            className="w-full px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Connect
          </button>

          <button
            onClick={handleLike}
            disabled={isLoadingLike}
            className={`w-full px-4 py-2 rounded border font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              isLiked
                ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                : 'border-slate-200 bg-white text-slate-700 hover:border-red-300 hover:text-red-600'
            }`}
          >
            <Heart
              className="h-4 w-4"
              fill={isLiked ? 'currentColor' : 'none'}
            />
            {isLoadingLike ? 'Loading...' : isLiked ? 'Liked' : 'Like'}
          </button>
        </div>
      </motion.div>

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded shadow-2xl max-w-sm w-full"
          >
            {connectStage === 'selecting' && (
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Connect with seller
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Choose your preferred contact method
                  </p>
                </div>

                <div className="space-y-2">
                  {hasPhone && (
                    <button
                      onClick={() => handleConnect('whatsapp')}
                      className="w-full p-3 rounded border border-green-300 bg-green-50 hover:bg-green-100 text-green-700 font-semibold flex items-center gap-3 transition-colors text-sm"
                    >
                      <span className="text-xl">💬</span>
                      <span>WhatsApp</span>
                    </button>
                  )}

                  {hasEmail && (
                    <button
                      onClick={() => handleConnect('email')}
                      className="w-full p-3 rounded border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold flex items-center gap-3 transition-colors text-sm"
                    >
                      <span className="text-xl">📧</span>
                      <span>Email</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setShowConnectModal(false)}
                  className="w-full px-4 py-2 rounded border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            )}

            {connectStage === 'loading' && (
              <div className="p-12 text-center space-y-4">
                <div className="flex justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-4xl"
                  >
                    ⏳
                  </motion.div>
                </div>
                <p className="font-semibold text-slate-900">
                  Connecting you...
                </p>
                <p className="text-sm text-slate-600">
                  Opening {connectingWith === 'whatsapp' ? 'WhatsApp' : 'email'}
                </p>
              </div>
            )}

            {connectStage === 'success' && (
              <div className="p-12 text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="flex justify-center"
                >
                  <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                </motion.div>
                <p className="font-semibold text-slate-900">
                  Connected!
                </p>
                <p className="text-sm text-slate-600">
                  Your {connectingWith === 'whatsapp' ? 'WhatsApp' : 'email'} app is opening...
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  )
}
