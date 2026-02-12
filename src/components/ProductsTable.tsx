import { motion } from 'framer-motion';
import type { Product } from '../types';

export function ProductsTable({
  products,
  onApprove,
  onDelete
}: {
  products: Product[];
  onApprove?: (p: Product) => void;
  onDelete?: (p: Product) => void;
}) {
  return (
    <motion.div className="bg-white border border-gray-200 rounded-xl p-8 shadow-xl">
      <h2 className={`text-2xl font-bold mb-4 text-blue-700`}>Manage Products</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[720px]">
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
              <tr key={product.id} className="border-t">
                <td className="p-2">{product.title}</td>
                <td className="p-2">{product.seller?.name}</td>
                <td className="p-2">{product.price}</td>
                <td className="p-2">{product.approved ? 'Approved' : 'Pending'}</td>
                <td className="p-2">
                  <div className="flex gap-2 flex-wrap">
                    {!product.approved && (
                      <button
                        onClick={() => onApprove?.(product)}
                        className="px-3 py-1 text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 rounded"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => onDelete?.(product)}
                      className="px-3 py-1 text-sm bg-red-50 text-red-700 border border-red-200 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
