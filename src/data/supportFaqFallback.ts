export type SupportFallbackFaq = {
  id: string
  category: string
  title: string
  answer: string
  questions: string[]
  keywords: string[]
  action?: { label: string; path: string }
}

// Client-side help keeps chat and FAQ search useful while a backend deploy is unavailable.
export const supportFaqFallback: SupportFallbackFaq[] = [
  { id: 'browse', category: 'buying', title: 'Browse products', answer: 'Sign in with a buyer account, then open Products to browse available listings. Open a product card to view its details and the seller’s published contact options.', questions: ['How do I browse products?', 'Where can I find items for sale?'], keywords: ['browse', 'product', 'catalog', 'shop', 'find'], action: { label: 'Buyer sign in', path: '/auth/buyer' } },
  { id: 'buyer-account', category: 'account', title: 'Create a buyer account', answer: 'Choose Buyer from the sign-in or registration options and complete the registration form. Buyer accounts can browse products and access the buyer dashboard.', questions: ['How do I create a buyer account?', 'How do I sign up as a customer?'], keywords: ['buyer', 'account', 'register', 'sign up'], action: { label: 'Register as a buyer', path: '/auth/buyer' } },
  { id: 'seller-account', category: 'selling', title: 'Create a seller account', answer: 'Choose Seller from the sign-in or registration options and complete the form. Seller accounts can manage listings, profile details, and messages from the seller dashboard.', questions: ['How do I become a seller?', 'How do I start selling on Connect?'], keywords: ['seller', 'account', 'register', 'store'], action: { label: 'Register as a seller', path: '/auth/seller' } },
  { id: 'create-listing', category: 'selling', title: 'Create a product listing', answer: 'Sign in as a seller and open your dashboard. Enter a title, price, category, description, and at least one product image, then submit the form.', questions: ['How do I list a product?', 'How do I upload an item for sale?', 'What information is required for a listing?'], keywords: ['upload', 'create', 'publish', 'product', 'listing', 'image', 'price', 'post'], action: { label: 'Open seller dashboard', path: '/dashboard' } },
  { id: 'listing-images', category: 'selling', title: 'Listing image requirements', answer: 'A new product listing needs at least one image. If upload fails, check that you selected an image and try again. If it continues, include the listing title and error text in a support report.', questions: ['Why can’t I upload my product image?', 'How many photos do I need?'], keywords: ['image', 'photo', 'picture', 'upload', 'file'], action: { label: 'Open seller dashboard', path: '/dashboard' } },
  { id: 'edit-listing', category: 'selling', title: 'Edit or delete a listing', answer: 'Sellers can manage their own products from the seller dashboard. Open your product list and choose the edit or delete control. Confirm before deleting because deletion cannot be undone.', questions: ['How can I edit my product?', 'How do I change a listing price?', 'How do I delete a product?'], keywords: ['edit', 'update', 'change', 'delete', 'remove'], action: { label: 'Manage my listings', path: '/dashboard' } },
  { id: 'listing-review', category: 'selling', title: 'Listing approval and visibility', answer: 'New listings may need admin approval before buyers can see them. Check the listing status in your seller dashboard. If it remains pending, contact support with the listing title; the assistant cannot approve it.', questions: ['Why is my product not visible?', 'My product is pending', 'Why can’t buyers see my listing?'], keywords: ['approve', 'pending', 'visible', 'visibility', 'listing'], action: { label: 'Check seller dashboard', path: '/dashboard' } },
  { id: 'seller-contact', category: 'buying', title: 'Contact a seller', answer: 'Open a product listing and use the seller’s published contact details to ask about availability, price, or delivery. Connect does not confirm payment or delivery status.', questions: ['How do I contact a seller?', 'How can I ask if an item is available?', 'How do I ask about delivery?'], keywords: ['contact', 'seller', 'message', 'delivery', 'availability', 'phone'], action: { label: 'Browse products', path: '/products' } },
  { id: 'messages', category: 'messaging', title: 'Find your messages', answer: 'Sign in and open your dashboard to review messages. If you expected a message but cannot find it, confirm that you are signed into the right account.', questions: ['Where are my messages?', 'How do I read a message?', 'I can’t find a seller message'], keywords: ['message', 'inbox', 'chat', 'read'], action: { label: 'Open my dashboard', path: '/dashboard' } },
  { id: 'login', category: 'account', title: 'Sign in', answer: 'Use the sign-in option for your account role: buyer, seller, or admin. If a protected page redirects you to sign in, log in with an account that has the required role.', questions: ['How do I sign in?', 'Why am I being redirected to login?', 'I cannot access my dashboard'], keywords: ['login', 'sign in', 'role', 'redirect'], action: { label: 'Go to sign in', path: '/auth' } },
  { id: 'password', category: 'account', title: 'Password or login trouble', answer: 'Check that you are using the email address for the correct account and re-enter your password. Never share your password or verification codes in chat. If you still cannot sign in, contact the support team.', questions: ['I forgot my password', 'Why is my password not working?', 'I cannot log into my account'], keywords: ['password', 'forgot', 'wrong', 'login', 'email'], action: { label: 'Contact support', path: '/contact' } },
  { id: 'profile', category: 'account', title: 'Manage your profile', answer: 'Sellers can manage profile details from the seller dashboard. If you need to change information that is not editable there, contact support. Do not send passwords or private credentials.', questions: ['How do I edit my profile?', 'How do I change my seller information?'], keywords: ['profile', 'edit', 'change', 'name', 'details'], action: { label: 'Open seller dashboard', path: '/dashboard' } },
  { id: 'payment', category: 'safety', title: 'Payments and transaction status', answer: 'The current project does not document an in-app payment flow or transaction tracking. Contact the seller directly to agree on payment and delivery details; do not assume Connect has processed or secured a payment.', questions: ['How do I pay for an item?', 'Can I pay through Connect?', 'Where can I track my order?', 'How do I request a refund?'], keywords: ['payment', 'paid', 'transaction', 'refund', 'order', 'money'], action: { label: 'Contact support', path: '/contact' } },
  { id: 'safety', category: 'safety', title: 'Buy safely', answer: 'Review product and seller information and ask the seller to clarify details before arranging a transaction. Connect does not describe an in-app payment or buyer-protection guarantee. Never share passwords, verification codes, or payment credentials in chat.', questions: ['How can I buy safely?', 'Is my payment protected?', 'I think a seller is a scammer'], keywords: ['safe', 'safety', 'trust', 'scam', 'fraud', 'protect'], action: { label: 'Report a safety issue', path: '/contact' } },
  { id: 'search', category: 'buying', title: 'Find a specific product', answer: 'Open the Products page and browse the available catalog. A product may not appear if it has not been listed or is still awaiting approval.', questions: ['How do I find a specific item?', 'Why can’t I find a product?'], keywords: ['search', 'find', 'filter', 'category', 'missing', 'catalog'], action: { label: 'Browse products', path: '/products' } },
  { id: 'contact', category: 'general', title: 'Contact Connect support', answer: 'Use the Contact page or choose Contact the support team in this chat. Include the page, what you were trying to do, and the exact error text. Never include passwords, verification codes, or payment credentials.', questions: ['How do I talk to a person?', 'How can I contact Connect?', 'Can I speak with support?'], keywords: ['help', 'support', 'contact', 'problem', 'issue', 'human'], action: { label: 'Open Contact page', path: '/contact' } },
  { id: 'technical', category: 'technical', title: 'Page or action not working', answer: 'Refresh the page and try again. Check your connection, sign-in role, and required form fields. For product uploads, include at least one image. If it continues, report the page, action, and exact error shown.', questions: ['The page is broken', 'Why is the site not loading?', 'A button does not work', 'I got an error message'], keywords: ['broken', 'error', 'failed', 'not working', 'loading', 'page', 'form'], action: { label: 'Report a technical issue', path: '/contact' } },
  { id: 'about', category: 'general', title: 'About Connect', answer: 'Connect is a local marketplace that helps buyers discover products and sellers publish listings. The site includes role-specific accounts, product listings, dashboards, and messaging.', questions: ['What is Connect?', 'What can I do on this website?', 'How does Connect work?'], keywords: ['about', 'marketplace', 'company', 'purpose'], action: { label: 'Learn about Connect', path: '/about' } },
]

const STOP_WORDS = new Set(['the', 'and', 'for', 'you', 'your', 'what', 'how', 'can', 'could', 'please', 'with', 'from', 'this', 'that', 'have', 'does', 'why', 'help', 'my', 'are', 'is', 'it', 'where', 'when', 'who', 'did', 'do', 'i', 'me', 'we', 'a', 'an', 'to', 'on', 'in', 'of', 'as', 'be', 'not', 'can’t', 'cannot'])

function tokens(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((word) => word.length > 2 && !STOP_WORDS.has(word))
}

export function searchLocalFaqs(query: string) {
  const terms = tokens(query)
  if (!terms.length) return supportFaqFallback
  return supportFaqFallback.map((faq) => {
    const haystack = tokens(`${faq.title} ${faq.answer} ${faq.questions.join(' ')} ${faq.keywords.join(' ')}`)
    let score = terms.reduce((sum, term) => sum + (haystack.some((word) => word === term || (term.length > 4 && word.startsWith(term.slice(0, -1)))) ? 1 : 0), 0)
    if (faq.questions.some((question) => terms.filter((term) => tokens(question).includes(term)).length >= Math.min(2, terms.length))) score += 3
    return { faq, score }
  }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).map(({ faq }) => faq)
}

export function answerWithLocalFaq(query: string) {
  const matches = searchLocalFaqs(query)
  if (!matches.length) return {
    answer: 'I’m not sure about that yet. Tell me which Connect page you are on and what you were trying to do, or choose Contact the support team and I’ll help you prepare a report.',
    category: 'general', sources: [], suggestedQuestions: ['How do I contact support?', 'How do I create a product listing?'], actions: [{ label: 'Contact support', path: '/contact' }], needsHuman: true,
  }
  const top = matches[0]
  const related = matches.slice(1, 3).flatMap((faq) => faq.questions.slice(0, 1))
  return { answer: top.answer, category: top.category, sources: [top.title], suggestedQuestions: top.questions.filter((question) => question.toLowerCase() !== query.toLowerCase()).slice(0, 3).concat(related).slice(0, 3), actions: top.action ? [top.action] : [], needsHuman: false }
}
