import { motion } from 'framer-motion';
import type { User } from '../types';

export function UsersTable({ users, onView, onResetPassword, onDelete }: { users: User[]; onView?: (u: User) => void; onResetPassword?: (u: User) => void; onDelete?: (u: User) => void; }) {
  return (
    <motion.div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xl">
      <h2 className={`text-2xl font-bold mb-4 text-blue-700`}>Manage Users</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">{user.isActive ? 'Active' : 'Inactive'}</td>
              <td className="p-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => onView?.(user)} className="px-3 py-1 rounded bg-sky-50 text-sky-600 border border-sky-200 text-sm">View</button>
                  <button onClick={() => onResetPassword?.(user)} className="px-3 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 text-sm">Reset PW</button>
                  <button onClick={() => onDelete?.(user)} className="px-3 py-1 rounded bg-red-50 text-red-700 border border-red-200 text-sm">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}