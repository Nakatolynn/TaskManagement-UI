import React, { useEffect, useState } from 'react'
import { createTask, updateTask, getTask } from '../api/client'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'

export default function TaskForm({ task, onDone }) {
  const [form, setForm] = useState({ title: '', description: '', status: 'todo', dueDate: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const isEdit = !!task

  useEffect(() => {
    if (isEdit) {
      // load full task if only id was provided
      if (typeof task === 'object' && task.title) setForm(f => ({ ...f, ...task }))
      else getTask(task.id).then(t => setForm(f => ({ ...f, ...t }))).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task])

  function change(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (isEdit) await updateTask(task.id, form)
      else await createTask(form)
      onDone()
    } catch (e) {
      setError(e.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={submit} sx={{ maxWidth: 640 }}>
      <Stack spacing={2}>
        <h2>{isEdit ? 'Edit Task' : 'Create Task'}</h2>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Title" name="title" value={form.title} onChange={change} required fullWidth />
        <TextField label="Description" name="description" value={form.description} onChange={change} multiline rows={4} fullWidth />

        <FormControl fullWidth>
          <InputLabel id="status-label">Status</InputLabel>
          <Select labelId="status-label" label="Status" name="status" value={form.status} onChange={change}>
            <MenuItem value="todo">To do</MenuItem>
            <MenuItem value="in_progress">In progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
        </FormControl>

        <TextField name="dueDate" label="Due" type="date" value={form.dueDate} onChange={change} InputLabelProps={{ shrink: true }} fullWidth />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Saving…' : 'Save'}</Button>
          <Button type="button" variant="outlined" onClick={onDone}>Cancel</Button>
        </Box>
      </Stack>
    </Box>
  )
}
