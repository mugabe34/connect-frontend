const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
 const isForm = init?.body instanceof FormData;
 const defaultHeaders: Record<string, string> = isForm ? {} : { 'Content-Type': 'application/json' };

 const res = await fetch(`${API_BASE}${path}`, {
 credentials: 'include',
  headers: { ...(defaultHeaders), ...(init?.headers || {}) },
  ...init,
  });
 if (!res.ok) {
   try {
     const data = await res.json();
     const message = data?.message || data?.error || 'Something went wrong. Please try again.';
     throw new Error(message);
   } catch (err: any) {
     // fallback to text if json parse fails
     const text = typeof err?.message === 'string' ? err.message : await res.text();
     throw new Error(text || 'Something went wrong. Please try again.');
   }
 }
 return res.json() as Promise<T>;
}

// Get full image URL with API base
export function getImageUrl(imagePath: string): string {
 if (!imagePath) return '';
 const normalized = String(imagePath).trim().replace(/\\/g, '/');
 // If it already starts with http, return as is (with a small fixup for uploads URLs).
 if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
  try {
   const absolute = new URL(normalized);
   const base = new URL(API_BASE);
   // If a stored URL points to this API host but uses the wrong protocol, rewrite it.
   if (absolute.pathname.startsWith('/uploads/') && absolute.host === base.host) {
    return `${base.origin}${absolute.pathname}${absolute.search}${absolute.hash}`;
   }
  } catch {
   // ignore parsing errors
  }
  return normalized;
 }
 const base = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
 const path = normalized.startsWith('/') ? normalized : `/${normalized}`;
 // Otherwise, prepend the API_BASE
 return `${base}${path}`;
}





