import { useState } from 'react'
import { useToast } from '../components/Toast'

export function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const { show } = useToast()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !message) return show('Please fill all fields', 'error')
    show('Message sent (stub)', 'success')
    setName(''); setEmail(''); setMessage('')
  }

  return (
    <div className="container-max py-10">
      <div className="max-w-2xl mx-auto bg-white border rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-4">Contact Us</h1>
        <form className="grid sm:grid-cols-2 gap-4" onSubmit={submit}>
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full border rounded px-3 py-2 min-h-[140px]" required />
          </div>
          <div className="sm:col-span-2">
            <button className="px-4 py-2 rounded bg-primary text-white">Send</button>
          </div>
        </form>
      </div>
    </div>
  )
}


