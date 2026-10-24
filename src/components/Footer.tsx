import { Link, useLocation } from 'react-router-dom'
import conlogo from '../assets/conlogo-256.png'
import { CONNECT_CONTACT_EMAILS, CONNECT_CONTACT_PHONES } from '../lib/contact'

export function Footer() {
  const { pathname } = useLocation()
  if (pathname === '/') return null
  return (
    <footer className="border-t bg-white">
      <div className="container-max py-8 text-sm text-gray-600 grid md:grid-cols-4 gap-6 items-start">
        <div className="flex items-center gap-2">
          <img src={conlogo} alt="Connect" className="h-8 w-auto" />
          <div>
            <div className="font-semibold mb-1">Connect</div>
            <p>Buy and sell locally with trust.</p>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-2">Contact</div>
          <>
            <div>Email: {CONNECT_CONTACT_EMAILS.join(', ')}</div>
            <div>Phone: {CONNECT_CONTACT_PHONES.join(' / ')}</div>
            <div>Location: Kigali, Rwanda</div>
          </>
        </div>
        <div>
          <div className="font-semibold mb-2">Company</div>
          <ul className="space-y-1">
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><a href="https://x.com" target="_blank" className="hover:underline" rel="noopener noreferrer">X</a></li>
            <li><a href="https://github.com" target="_blank" className="hover:underline" rel="noopener noreferrer">GitHub</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Legal</div>
          <ul className="space-y-1">
            <li>Terms</li>
            <li>Privacy</li>
          </ul>
        </div>
      </div>
      <div className="container-max pb-6 text-xs text-right text-gray-500">Powered by Mugabe && Maurice</div>
    </footer>
  )
}


