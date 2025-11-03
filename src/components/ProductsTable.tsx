import { motion } from 'framer-motion';
import { Product } from '../types';

export function ProductsTable({ products }: { products: Product[] }) {
  return (
    <motion.div className="bg-white border border-gray-200 rounded-xl p-8 shadow-xl">
      <h2 className={`text-2xl font-bold mb-4 text-blue-700`}>Manage Products</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="p-2">Title</th>
            <th className="p-2">Seller</th>
            <th className="p-2">Price</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td className="p-2">{product.title}</td>
              <td className="p-2">{product.seller?.name}</td>
              <td className="p-2">{product.price}</td>
              <td className="p-2">{product.approved ? 'Approved' : 'Pending'}</td>
              <td className="p-2">...</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}