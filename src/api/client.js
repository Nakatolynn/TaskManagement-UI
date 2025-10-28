const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

async function handleResponse(res) {
  const text = await res.text()
  let data
  try { data = text ? JSON.parse(text) : null } catch (e) { data = text }
  if (!res.ok) {
    const err = new Error(data?.message || res.statusText)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export async function getTasks() {
  const res = await fetch(`${BASE}/tasks`)
  return handleResponse(res)
}

export async function getTask(id) {
  const res = await fetch(`${BASE}/tasks/${id}`)
  return handleResponse(res)
}

export async function createTask(payload) {
  const res = await fetch(`${BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse(res)
}

export async function updateTask(id, payload) {
  const res = await fetch(`${BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse(res)
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE}/tasks/${id}`, { method: 'DELETE' })
  return handleResponse(res)
}
