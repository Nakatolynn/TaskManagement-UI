import React, { useEffect, useState } from 'react'
import { getTask } from '../api/client'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

export default function TaskDetail({ id, onBack }) {
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    getTask(id)
      .then(data => setTask(data))
      .catch(e => setError(e.message || 'Failed'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <Box>
      <Button onClick={onBack} sx={{ mb: 2 }}>&larr; Back</Button>
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
      {error && <Alert severity="error">{error}</Alert>}
      {task && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>{task.title}</Typography>
            <Typography variant="body1" paragraph>{task.description}</Typography>
            <Typography variant="body2">Status: {task.status || 'N/A'}</Typography>
            <Typography variant="body2">Due: {task.dueDate || '—'}</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
