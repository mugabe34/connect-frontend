const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
 const isForm = init?.body instanceof FormData;
 const defaultHeaders: Record<string, string> = isForm ? {} : { 'Content-Type': 'application/json' };

 const res = await fetch(`${API_BASE}${path}`, {
 credentials: 'include',
 headers: { ...(defaultHeaders), ...(init?.headers || {}) },
 ...init,
 });
 if (!res.ok) throw new Error(await res.text());
 return res.json() as Promise<T>;
}





