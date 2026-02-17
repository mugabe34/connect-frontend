import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageSquare, Phone, CheckCircle2, Mail } from 'lucide-react'
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
  const [showDetails, setShowDetails] = useState(false)
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
  const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="currentColor">
      <path d="M19.11 17.53c-.26-.13-1.53-.76-1.77-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.01-.15.17-.3.19-.56.06-.26-.13-1.1-.41-2.1-1.3-.78-.69-1.3-1.54-1.45-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.8-1.92-.21-.5-.42-.43-.58-.44h-.49c-.17 0-.45.06-.69.32-.24.26-.91.89-.91 2.17 0 1.28.93 2.51 1.06 2.69.13.17 1.82 2.78 4.41 3.9.62.27 1.1.43 1.48.55.62.2 1.18.17 1.62.1.5-.07 1.53-.62 1.74-1.22.22-.6.22-1.11.15-1.22-.06-.11-.24-.17-.5-.3z" />
      <path d="M16.03 3.2c-7.03 0-12.75 5.72-12.75 12.75 0 2.25.59 4.44 1.71 6.37L3.2 28.8l6.65-1.75a12.69 12.69 0 0 0 6.18 1.6h.01c7.03 0 12.75-5.72 12.75-12.75S23.06 3.2 16.03 3.2zm0 22.06h-.01c-2.01 0-3.98-.54-5.7-1.56l-.41-.24-3.95 1.04 1.06-3.85-.27-.4a9.99 9.99 0 0 1-1.61-5.43c0-5.52 4.49-10.01 10.01-10.01 2.68 0 5.2 1.05 7.09 2.93a9.95 9.95 0 0 1 2.92 7.08c0 5.52-4.49 10.01-10.13 10.01z" />
    </svg>
  )
  return (
    <>
      <motion.div
        className="h-full bg-white rounded border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
        whileHover={{ y: -2 }}
      >
        {/* Product Image */}
        <button
          type="button"
          onClick={() => setShowDetails(true)}
          className="h-52 w-full bg-slate-100 overflow-hidden relative group text-left"
          aria-label={`View details for ${product.title}`}
        >
          {product.images && product.images.length > 0 ? (
            <motion.img
              src={getImageUrl(product.images[0].url)}
              alt={product.title}
              className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-300"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded bg-white/90 text-slate-900 text-sm font-bold shadow">
              FRw {Number(product.price || 0).toLocaleString()}
            </span>
            <span className="px-2 py-1 rounded bg-white/90 text-slate-700 text-xs font-semibold flex items-center gap-1 shadow">
              <Heart className="h-3.5 w-3.5" fill="currentColor" />
              {product.likes || 0}
            </span>
          </div>
        </button>
        {/* Product Content */}
        <div className="flex-1 p-4 flex flex-col gap-3">
          {/* Title */}
          <div>
            <h3 className="font-bold text-slate-900 line-clamp-2 text-base">
              {product.title}
            </h3>
          </div>
          {/* Seller Info */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">{product.seller?.name || 'Unknown Seller'}</span>
            {product.seller?.location && (
              <span className="flex items-center gap-1">
                <span>📍</span>
                <span className="font-medium">{product.seller.location}</span>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowDetails(true)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View details
          </button>
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

      {/* Product Details Modal */}
      {showDetails && (
        <div
          className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetails(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2">
              <div className="bg-slate-100">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={getImageUrl(product.images[0].url)}
                    alt={product.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/600x400?text=No+Image'
                    }}
                  />
                ) : (
                  <div className="h-full min-h-[240px] flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <div className="text-center">
                      <div className="text-5xl mb-2">📦</div>
                      <p className="text-sm text-slate-500">No image</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{product.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{product.category || 'General'}</p>
                </div>
                {product.description && (
                  <p className="text-sm text-slate-700 leading-relaxed">{product.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-slate-900">
                    FRw {Number(product.price || 0).toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                    <Heart className="h-4 w-4" fill="currentColor" />
                    {product.likes || 0} {product.likes === 1 ? 'like' : 'likes'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-slate-400 font-medium">Seller</p>
                    <p className="text-slate-900 font-semibold">{product.seller?.name || 'Unknown Seller'}</p>
                  </div>
                  {product.seller?.location && (
                    <div>
                      <p className="text-slate-400 font-medium">Location</p>
                      <p className="text-slate-900 font-semibold">{product.seller.location}</p>
                    </div>
                  )}
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
                </div>
                <div className="pt-2 space-y-2">
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
                    <Heart className="h-4 w-4" fill={isLiked ? 'currentColor' : 'none'} />
                    {isLoadingLike ? 'Loading...' : isLiked ? 'Liked' : 'Like'}
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="w-full px-4 py-2 rounded border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
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
                      <span className='h-6 w-6 rounded-full bg-emerald-600 text-white grid place-items-center flex-shrink-0'>
                        <WhatsAppIcon className='h-4 w-4' />
                      </span>
                      <span>WhatsApp</span>
                    </button>
                  )}
                  {hasEmail && (
                    <button
                      onClick={() => handleConnect('email')}
                      className="w-full p-3 rounded border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold flex items-center gap-3 transition-colors text-sm"
                    >
                      <span className='h-6 w-6 rounded-full bg-blue-600 text-white grid place-items-center flex-shrink-0'>
                        <Mail className='h-4 w-4' />
                      </span>
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
