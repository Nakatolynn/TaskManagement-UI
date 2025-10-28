import React, { useEffect, useState } from 'react'
import { getTasks, deleteTask } from '../api/client'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export default function TaskList({ onOpenDetail, onCreate, onEdit }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await getTasks()
      setTasks(data || [])
    } catch (e) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id) {
    if (!confirm('Delete this task?')) return
    try {
      await deleteTask(id)
      setTasks(t => t.filter(x => x.id !== id))
    } catch (e) {
      alert('Delete failed: ' + (e.message || e))
    }
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Tasks</Typography>
        <Button variant="contained" onClick={onCreate} startIcon={<EditIcon />}>New Task</Button>
      </Stack>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Grid container spacing={2}>
          {tasks.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1">No tasks yet</Typography>
            </Grid>
          )}

          {tasks.map(task => (
            <Grid item key={task.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ bgcolor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1, cursor: 'pointer' }} onClick={() => onOpenDetail(task.id)}>
                  <Typography variant="subtitle1" gutterBottom>{task.title}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph noWrap>{task.description}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={task.status || 'todo'} size="small" />
                    <Typography variant="caption" color="text.secondary">{task.dueDate || ''}</Typography>
                  </Stack>
                </CardContent>
                <CardActions>
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton size="small" onClick={() => onEdit(task)} aria-label="edit"><EditIcon /></IconButton>
                  <IconButton size="small" onClick={() => handleDelete(task.id)} aria-label="delete"><DeleteIcon /></IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box mt={2}>
        <Button onClick={load}>Refresh</Button>
      </Box>
    </Box>
  )
}
