import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'

export function AuthAdmin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const { show } = useToast()
  const navigate = useNavigate()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (name === 'mugabe' && email === 'mugabeherve7@gmail.com' && password === 'mugabe123@!!') {
      show('Admin authenticated', 'success')
      navigate('/admin')
    } else {
      show('Invalid admin credentials', 'error')
    }
  }

  return (
    <div className="container-max py-10">
      <div className="max-w-md mx-auto bg-white border rounded-lg p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
        <form className="space-y-3" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <button className="w-full px-4 py-2 rounded bg-primary text-white">Login</button>
        </form>
      </div>
    </div>
  )
}


