import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api, getImageUrl } from '../lib/api'
import type { Product, User } from '../types'

export function SellerProfile() {
 const { id } = useParams()
 const [seller, setSeller] = useState<User | null>(null)
 const [products, setProducts] = useState<Product[]>([])

 useEffect(() => {
 async function load() {
 const s = await api<User>(`/api/admin/users/${id}`)
 setSeller(s)
 const ps = await api<Product[]>(`/api/products?seller=${id}`)
 setProducts(ps)
 }
 if (id) load()
 }, [id])

 return (
 <div className="container-max py-10">
 {seller && (
 <div className="bg-white border rounded-lg p-6 shadow-sm">
 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
 <img src={(seller as any).avatarUrl ? getImageUrl((seller as any).avatarUrl) : `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.name)}`} alt={seller.name} className="w-24 h-24 rounded-full object-cover" />
 <div className="flex-1">
 <div className="flex items-center gap-3 flex-wrap">
 <h1 className="text-2xl font-semibold">{seller.name}</h1>
 {(seller as any).username && <span className="text-gray-500">@{(seller as any).username}</span>}
 <button className="px-3 py-1.5 rounded border hover:bg-slate-50">Follow / Unfollow</button>
 </div>
 {(seller as any).bio && <p className="text-gray-600 mt-1">{(seller as any).bio}</p>}
 <div className="flex gap-6 text-sm text-gray-600 mt-3">
 <div><span className="font-semibold">{(seller as any).followers ??0}</span> Followers</div>
 <div><span className="font-semibold">{(seller as any).following ??0}</span> Following</div>
 <div><span className="font-semibold">{(seller as any).productsCount ?? products.length}</span> Products</div>
 </div>
 </div>
 </div>
 </div>
 )}

 <div className="mt-8">
 <h2 className="text-xl font-semibold mb-4">Products</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
 {products.map((p) => (
 <motion.div key={p.id} className="border rounded-lg overflow-hidden bg-white shadow-sm" whileInView={{ opacity: [0,1], y: [8,0] }} viewport={{ once: true }}>
 {p.images?.[0]?.url ? (
 <img src={getImageUrl(p.images[0].url)} alt={p.title} className="h-40 w-full object-cover" />
 ) : (
 <div className="h-40 bg-gray-100" />
 )}
 <div className="p-4 space-y-1">
 <div className="font-medium line-clamp-1">{p.title}</div>
 <div className="text-blue-600 font-semibold">${p.price}</div>
 {p.description && <div className="text-sm text-gray-600 line-clamp-2">{p.description}</div>}
 <div className="pt-2">
 <button className="px-3 py-1.5 rounded border hover:bg-slate-50">View</button>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </div>
 )
}
