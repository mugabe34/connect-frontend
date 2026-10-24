import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Bot, Check, ChevronDown, CircleHelp, Headphones, MessageCircle, Send, ShieldCheck, User, X } from 'lucide-react'
import { api } from '../lib/api'
import { useAuth } from '../providers/AuthProvider'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { answerWithLocalFaq, searchLocalFaqs } from '../data/supportFaqFallback'

type ChatAction = { label: string; path: string }
type ChatMessage = { role: 'user' | 'assistant'; content: string; category?: string; sources?: string[]; needsHuman?: boolean; suggestedQuestions?: string[]; actions?: ChatAction[] }
type TicketResult = { reference: string; status: string; message: string }
type FaqItem = { id: string; category: string; title: string; answer: string; questions: string[]; action?: ChatAction }
const prompts = ['How do I list a product?', 'I can’t sign in', 'How do I contact a seller?', 'Why is my listing not visible?']

export function SupportChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: 'Hi! I’m Connect support. I can help with buying, selling, accounts, and common site issues. What can I help you with?' }])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [reportStep, setReportStep] = useState<'closed' | 'edit' | 'confirm' | 'done'>('closed')
  const [report, setReport] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [category, setCategory] = useState('general')
  const [submissionKey, setSubmissionKey] = useState('')
  const [ticket, setTicket] = useState<TicketResult | null>(null)
  const [reportError, setReportError] = useState('')
  const [faqsOpen, setFaqsOpen] = useState(false)
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [faqQuery, setFaqQuery] = useState('')
  const [faqBusy, setFaqBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }) }, [messages, busy, reportStep])
  useEffect(() => { if (open) inputRef.current?.focus() }, [open])

  async function loadFaqs(query = '') {
    setFaqBusy(true)
    try {
      const result = await api<{ faqs: FaqItem[] }>(`/api/support/faqs${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`)
      setFaqs(result.faqs)
    } catch {
      setFaqs(searchLocalFaqs(query))
    } finally { setFaqBusy(false) }
  }

  async function ask(question: string) {
    const trimmed = question.trim()
    if (!trimmed || busy) return
    const next = [...messages, { role: 'user' as const, content: trimmed }]
    setMessages(next); setInput(''); setBusy(true)
    try {
      const result = await api<{ answer: string; category: string; sources: string[]; needsHuman: boolean; suggestedQuestions: string[]; actions: ChatAction[] }>('/api/support/chat', {
        method: 'POST', body: JSON.stringify({ message: trimmed, history: messages.slice(-6).map(({ role, content }) => ({ role, content })) }),
      })
      setMessages((current) => [...current, { role: 'assistant', ...result, content: result.answer }])
      if (result.needsHuman) setCategory(result.category)
    } catch {
      // The deployed API may not have the support routes yet. Answer from the
      // bundled Connect help content instead of showing raw API errors.
      const fallback = answerWithLocalFaq(trimmed)
      setMessages((current) => [...current, { role: 'assistant', ...fallback, content: fallback.answer }])
      if (fallback.needsHuman) setCategory(fallback.category)
    } finally { setBusy(false) }
  }

  function startReport() {
    const latestIssue = [...messages].reverse().find((message) => message.role === 'user')?.content || ''
    setReport(latestIssue); setCategory([...messages].reverse().find((message) => message.category)?.category || 'general')
    setContactEmail(user?.email || ''); setSubmissionKey(crypto.randomUUID()); setTicket(null); setReportError(''); setReportStep('edit')
  }

  async function submitReport() {
    setBusy(true); setReportError('')
    try {
      const result = await api<TicketResult>('/api/support/tickets', { method: 'POST', body: JSON.stringify({ description: report, category, contactEmail, steps: [], submissionKey, pagePath: location.pathname }) })
      setTicket(result); setReportStep('done')
    } catch (error) {
      setReportError(error instanceof Error ? error.message : 'Could not submit your report. Please retry.')
    } finally { setBusy(false) }
  }

  function onSubmit(e: FormEvent) { e.preventDefault(); void ask(input) }

  return <>
    <button type="button" aria-label={open ? 'Close Connect support' : 'Open Connect support'} aria-expanded={open} onClick={() => setOpen(!open)} className="support-launcher">
      {open ? <X size={21} /> : <><MessageCircle size={21} /><span>Need help?</span></>}
    </button>
    {open && <section className="support-panel" aria-label="Connect support assistant">
      <header className="support-header">
        <div className="support-avatar"><Bot size={20} /></div>
        <div className="min-w-0 flex-1"><div className="font-semibold">Connect support</div><div className="support-online"><span /> Here to help</div></div>
        <button type="button" onClick={() => { const next = !faqsOpen; setFaqsOpen(next); if (next && !faqs.length) void loadFaqs() }} aria-label={faqsOpen ? 'Close common questions' : 'Browse common questions'} title="Browse common questions" className="support-icon-button"><CircleHelp size={18} /></button>
        <button type="button" onClick={() => setOpen(false)} aria-label="Minimize support chat" className="support-icon-button"><ChevronDown size={19} /></button>
      </header>
      <div className="support-trust"><ShieldCheck size={14} /> Don’t share passwords or payment details</div>
      <div className="support-messages" ref={scrollRef} aria-live="polite" aria-relevant="additions text">
        {faqsOpen && <div className="support-faq-card">
          <div className="support-faq-heading"><strong>Common questions</strong><span>Choose one and I’ll help.</span></div>
          <form onSubmit={(event) => { event.preventDefault(); void loadFaqs(faqQuery) }} className="support-faq-search"><input value={faqQuery} onChange={(event) => setFaqQuery(event.target.value)} placeholder="Search Connect help" aria-label="Search common questions" /><button type="submit" disabled={faqBusy}>{faqBusy ? '…' : 'Search'}</button></form>
          {faqBusy && <p className="support-faq-note">Finding answers…</p>}
          {!faqBusy && faqs.length === 0 && <p className="support-faq-note">No matching help articles. Try another search or ask support below.</p>}
          <div className="support-faq-list">{faqs.slice(0, 12).map((faq) => <button type="button" key={faq.id} onClick={() => { setFaqsOpen(false); void ask(faq.questions[0] || faq.title) }}><span>{faq.title}</span><small>{faq.questions[0]}</small></button>)}</div>
        </div>}
        {messages.map((message, index) => <div key={`${index}-${message.role}`} className="support-message-group">
          <div className={`support-row ${message.role}`}>
            <span className="support-message-icon">{message.role === 'assistant' ? <Bot size={15} /> : <User size={15} />}</span>
            <div className={`support-bubble ${message.role}`}>
              <p>{message.content}</p>
              {message.sources?.length ? <div className="support-source">Connect help · {message.sources.slice(0, 2).join(', ')}</div> : null}
              {message.actions?.map((action) => <button className="support-action-link" key={action.path} onClick={() => { navigate(action.path); setOpen(false) }}>{action.label} <span aria-hidden="true">→</span></button>)}
            </div>
          </div>
          {message.role === 'assistant' && index === messages.length - 1 && message.suggestedQuestions?.length ? <div className="support-followups">{message.suggestedQuestions.map((question) => <button key={question} onClick={() => void ask(question)}>{question}</button>)}</div> : null}
        </div>)}
        {busy && reportStep === 'closed' && <div className="support-row assistant"><span className="support-message-icon"><Bot size={15} /></span><div className="support-bubble assistant support-typing" aria-label="Assistant is typing"><i /><i /><i /></div></div>}
        {reportStep === 'edit' && <div className="support-report-card">
          <strong>Prepare a support report</strong><p>Review what will be shared with the Connect support team.</p>
          <label>Issue description<textarea maxLength={4000} value={report} onChange={(e) => setReport(e.target.value)} placeholder="Describe what happened" /></label>
          <label>Category<select value={category} onChange={(e) => setCategory(e.target.value)}>{[['buying','Buying'],['selling','Selling'],['account','Account'],['messaging','Messaging'],['safety','Trust & safety'],['technical','Technical issue'],['general','General support']].map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label>Your email (optional)<input type="email" maxLength={254} value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="you@example.com" /></label>
          <div className="support-actions"><button className="support-secondary" onClick={() => setReportStep('closed')}>Cancel</button><button className="support-primary" disabled={!report.trim()} onClick={() => setReportStep('confirm')}>Review report</button></div>
        </div>}
        {reportStep === 'confirm' && <div className="support-report-card">
          <strong>Send this report?</strong><p>We’ll email the issue description, selected category, and your contact email (if provided). Conversation text beyond the issue description isn’t included.</p>
          <div className="support-review"><b>{category}</b><span>{report}</span>{contactEmail && <small>Reply to: {contactEmail}</small>}</div>
          {reportError && <p className="support-error" role="alert">{reportError}</p>}
          <div className="support-actions"><button className="support-secondary" onClick={() => setReportStep('edit')}>Edit</button><button className="support-primary" disabled={busy} onClick={() => void submitReport()}>{busy ? 'Sending…' : 'Confirm and send'}</button></div>
        </div>}
        {reportStep === 'done' && ticket && <div className={`support-ticket ${ticket.status}`} role="status"><Check size={17} /><div><strong>{ticket.status === 'sent' ? 'Report submitted' : 'Report saved'}</strong><p>{ticket.status === 'sent' ? 'The email provider accepted your report.' : ticket.message}</p><b>Reference: {ticket.reference}</b></div></div>}
      </div>
      {reportStep === 'closed' && <>
        {messages.length === 1 && !faqsOpen && <div className="support-prompts">{prompts.map((prompt) => <button key={prompt} onClick={() => void ask(prompt)}>{prompt}</button>)}</div>}
        <button className="support-human-link" onClick={startReport}><Headphones size={15} /> Contact the support team</button>
        <form className="support-composer" onSubmit={onSubmit}><input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} maxLength={2000} placeholder="Ask Connect support…" aria-label="Message Connect support" /><button type="submit" aria-label="Send message" disabled={!input.trim() || busy}><Send size={18} /></button></form>
        <div className="support-powered">Connect marketplace support</div>
      </>}
    </section>}
  </>
}
