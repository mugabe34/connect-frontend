import { motion } from 'framer-motion';
import { User } from '../types';

export function UsersTable({ users }: { users: User[] }) {
  return (
    <motion.div className="bg-white border border-gray-200 rounded-xl p-8 shadow-xl">
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
            <tr key={user.id}>
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">{user.isActive ? 'Active' : 'Inactive'}</td>
              <td className="p-2">...</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}