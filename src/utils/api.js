// Central API configuration
// In development, requests go through the Vite proxy (/api → http://localhost:8000)
// so CORS is handled automatically — no need to touch the backend CORS settings.
// For production, change this to your deployed backend URL, e.g. 'https://api.yourcivicai.com'
export const BASE_URL = '/api'

/**
 * Returns auth headers with the JWT token stored in localStorage.
 * SignIn.jsx saves the token under the key 'civicai_token'.
 */
export function authHeaders() {
  const token = localStorage.getItem('civicai_token')
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' }
}

/**
 * Generic fetch wrapper — throws on network errors, returns parsed JSON.
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: authHeaders(),
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.detail || data.message || `Error ${res.status}`)
  return data
}
