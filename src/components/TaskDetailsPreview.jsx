import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack,
  CalendarToday,
  Schedule,
  CheckCircle,
  Assignment,
  Person,
  Subtitles,
  Delete,
  Edit,
  Info,
  ContentCopy,
} from "@mui/icons-material";
import TaskManagementApis from "../api/TaskManagementApis";

// Status mapping with better labels
const STATUS_MAP = {
  0: {
    label: "Open",
    color: "default",
    description: "Task has been created but not started",
  },
  1: {
    label: "Pending",
    color: "warning",
    description: "Task is waiting for action",
  },
  2: {
    label: "In Progress",
    color: "primary",
    description: "Task is currently being worked on",
  },
  3: {
    label: "In Review",
    color: "secondary",
    description: "Task is under review",
  },
  4: {
    label: "Completed",
    color: "success",
    description: "Task has been completed",
  },
  5: { label: "Closed", color: "success", description: "Task has been closed" },
};

export default function TaskDetailsPreview({ user, onLogout }) {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subtaskToDelete, setSubtaskToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "Not set";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getStatusInfo = (status, isComplete) => {
    if (isComplete) {
      return {
        label: "Completed",
        color: "success",
        description: "Task has been finished",
      };
    }
    return (
      STATUS_MAP[status] || {
        label: "Unknown",
        color: "default",
        description: "Status not available",
      }
    );
  };

  useEffect(() => {
    const storedTask = sessionStorage.getItem("selectedTask");
    if (storedTask) {
      try {
        const parsedTask = JSON.parse(storedTask);
        if (parsedTask.taskId === taskId) {
          setTask(parsedTask);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    const fetchTask = async () => {
      try {
        const taskData = await TaskManagementApis.getTaskById(taskId);
        setTask(taskData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load task details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleBack = () => navigate(-1);

  const handleDeleteSubtask = (subtask) => {
    setSubtaskToDelete(subtask);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSubtask = async () => {
    if (!subtaskToDelete) return;
    try {
      setLoading(true);
      await TaskManagementApis.deleteTask(subtaskToDelete.taskId);
      setTask({
        ...task,
        subTasks: task.subTasks.filter(
          (st) => st.taskId !== subtaskToDelete.taskId
        ),
      });
      setSnackbar({
        open: true,
        message: "Subtask deleted successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to delete subtask.",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setSubtaskToDelete(null);
    }
  };

  const cancelDeleteSubtask = () => {
    setDeleteDialogOpen(false);
    setSubtaskToDelete(null);
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbar({
      open: true,
      message: "Copied to clipboard",
      severity: "success",
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} />
        <Typography sx={{ ml: 2 }}>Loading task details...</Typography>
      </Box>
    );
  }

  if (error || !task) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || "Task not found"}
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Task ID: {taskId}
          </Typography>
          <Button
            onClick={handleBack}
            variant="contained"
            startIcon={<ArrowBack />}
          >
            Back to Tasks
          </Button>
        </Paper>
      </Box>
    );
  }

  const statusInfo = getStatusInfo(task.status, task.isComplete);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Button
          onClick={handleBack}
          startIcon={<ArrowBack />}
          variant="outlined"
          sx={{ borderRadius: "8px", textTransform: "none" }}
        >
          Back to Task List
        </Button>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Task Details
        </Typography>
        <Box sx={{ width: 140 }} />
      </Box>

      <Grid container spacing={3}>
        {/* Main Task Information */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  gutterBottom
                  color="primary"
                >
                  {task.taskName || "Unnamed Task"}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                    color: "text.secondary",
                  }}
                >
                  {task.description || "No description provided"}
                </Typography>
              </Box>

              {/* Status Section */}
              <Box sx={{ mb: 4, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <CheckCircle color="primary" />
                  Status
                  <Tooltip title={statusInfo.description}>
                    <Info fontSize="small" />
                  </Tooltip>
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip
                    label={statusInfo.label}
                    color={statusInfo.color}
                    size="medium"
                    sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {statusInfo.description}
                  </Typography>
                </Stack>
              </Box>

              {/* Timeline Information */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <CalendarToday color="primary" />
                  Timeline
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          gutterBottom
                        >
                          Created Date
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatDate(task.createdAt)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          gutterBottom
                        >
                          Due Date
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          color={
                            task.dueDate ? "text.primary" : "text.secondary"
                          }
                        >
                          {formatDate(task.dueDate)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          gutterBottom
                        >
                          Submission Date
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatDate(task.submissionDate)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          gutterBottom
                        >
                          Review Date
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatDate(task.reviewDate)}
                        </Typography>
                      </Box>
                      {task.completionDate && (
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            gutterBottom
                          >
                            Completion Date
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            color="success.main"
                          >
                            {formatDate(task.completionDate)}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Task Metadata */}
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Assignment color="primary" /> Task Information
                </Typography>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Task ID
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" fontFamily="monospace">
                        {task.taskId}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(task.taskId)}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Completion Status
                    </Typography>
                    <Chip
                      label={task.isComplete ? "Completed" : "Incomplete"}
                      color={task.isComplete ? "success" : "warning"}
                      size="small"
                    />
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Number of Subtasks
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {task.subTasks ? task.subTasks.length : 0}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Assigned User */}
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Person color="primary" /> Assigned User
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      User ID
                    </Typography>
                    <Typography variant="body2" fontFamily="monospace">
                      {task.userId}
                    </Typography>
                  </Box>
                  {user && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Current User
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.userName}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Subtasks */}
      {Array.isArray(task.subTasks) && task.subTasks.length > 0 ? (
        <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Subtitles color="primary" /> Subtasks ({task.subTasks.length})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage individual subtasks
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {task.subTasks.map((subtask) => {
                const subtaskStatus = getStatusInfo(
                  subtask.status,
                  subtask.isComplete
                );
                return (
                  <Grid item xs={12} md={6} key={subtask.taskId}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        position: "relative",
                        height: "100%",
                      }}
                    >
                      {/* Action Buttons */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          display: "flex",
                          gap: 1,
                        }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            sessionStorage.setItem(
                              "selectedSubtask",
                              JSON.stringify(subtask)
                            );
                            navigate(`/subtask-edit/${subtask.taskId}`);
                          }}
                          sx={{
                            backgroundColor: "primary.light",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "primary.main",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteSubtask(subtask)}
                          sx={{
                            backgroundColor: "error.light",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "error.main",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Subtask Info */}
                      <Box sx={{ mb: 2, pr: 4 }}>
                        <Typography variant="h6" fontWeight="600">
                          {subtask.taskName}
                        </Typography>
                        <Chip
                          label={subtaskStatus.label}
                          color={subtaskStatus.color}
                          size="small"
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {subtask.description || "No description provided"}
                      </Typography>

                      <Stack spacing={1}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Due Date:
                          </Typography>
                          <Typography variant="caption" fontWeight="medium">
                            {formatDate(subtask.dueDate)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Created:
                          </Typography>
                          <Typography variant="caption" fontWeight="medium">
                            {formatDate(subtask.createdAt)}
                          </Typography>
                        </Box>
                        {subtask.completionDate && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Completed:
                            </Typography>
                            <Typography
                              variant="caption"
                              fontWeight="medium"
                              color="success.main"
                            >
                              {formatDate(subtask.completionDate)}
                            </Typography>
                          </Box>
                        )}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Assigned To:
                          </Typography>
                          <Typography variant="caption" fontWeight="medium">
                            {subtask.assignedTo}
                          </Typography>
                        </Box>
                      </Stack>

                      <Box
                        sx={{
                          mt: 2,
                          pt: 1,
                          borderTop: 1,
                          borderColor: "divider",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Subtask ID: {subtask.taskId}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mt: 3, textAlign: "center" }}
        >
          No subtasks available
        </Typography>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={cancelDeleteSubtask}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the subtask "
          {subtaskToDelete?.taskName}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteSubtask}>Cancel</Button>
          <Button
            onClick={confirmDeleteSubtask}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
