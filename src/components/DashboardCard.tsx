import { motion } from 'framer-motion';

export function DashboardCard({ title, value }: { title: string, value: number }) {
  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition duration-300 cursor-default"
      whileHover={{ y: -2 }}
    >
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className={`text-4xl font-extrabold mt-2 text-blue-600`}>
        {value}
      </div>
    </motion.div>
  )
}