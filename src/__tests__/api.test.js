import { describe, it, expect, vi } from 'vitest'
import * as client from '../api/client'

describe('api client', () => {
  it('calls /tasks for getTasks', async () => {
    const fake = [{ id: 1, title: 'a' }]
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true, text: async () => JSON.stringify(fake) })
    const res = await client.getTasks()
    expect(fetchSpy).toHaveBeenCalled()
    expect(res).toEqual(fake)
    fetchSpy.mockRestore()
  })
})
