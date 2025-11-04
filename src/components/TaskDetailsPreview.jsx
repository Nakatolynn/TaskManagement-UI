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
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
    description: "Open",
  },
  1: {
    label: "Pending",
    color: "warning",
    description: "Pending Action",
  },
  2: {
    label: "In Progress",
    color: "primary",
    description: "In-Progress",
  },
  3: {
    label: "In Review",
    color: "secondary",
    description: "In Review",
  },
  4: {
    label: "Completed",
    color: "success",
    description: "Task  completed",
  },
  5: { label: "Closed", color: "success", description: "Task Closed" },
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
          sx={{ borderRadius: "8px", color:"#1e3c72"}}
        >
          Back to Task List
        </Button>
        <Typography variant="h5" fontWeight="bold" color="#1e3c72">
          Task Details
        </Typography>
        <Box sx={{ width: 140 }} />
      </Box>
      <Grid item xs={12}>
        <Accordion expanded>
          <AccordionDetails>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">
                  <b>Task Name</b>
                </Typography>
                <Typography> {task.taskName || "Unnamed Task"}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">
                  <b> Task Description:</b>
                </Typography>
                <Typography>
                  {" "}
                  {task.description || "No description provided"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">
                  <b>Due Date</b>
                </Typography>
                <Typography> {formatDate(task.dueDate)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">
                  <b>Status</b>
                </Typography>
                <Typography
                  fontWeight="bold"
                  sx={{
                    backgroundColor: "teal",
                    color: "white",
                    px: 1,
                    borderRadius: 20,
                    display: "inline-block",
                    textAlign: "center",
                    minWidth: 80,
                  }}
                >
                  {statusInfo.description}
                </Typography>{" "}
                <Typography variant="subtitle2">
                  <b>Created By</b>: {user.userName}
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>

      {Array.isArray(task.subTasks) && task.subTasks.length > 0 ? (
        <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle2">
              <b>Subtasks Details ({task.subTasks.length})</b>
            </Typography>

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
                        <Typography variant="subtitle2">
                          <b>SubTask Name</b>: {subtask.taskName}
                        </Typography>
                        <Typography variant="subtitle2">
                          <b>SubTask Description</b>:{" "}
                          {subtask.description || "No description provided"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Due Date: {formatDate(subtask.dueDate)}
                        </Typography>
                        <Typography variant="subtitle2">
                          <b>Created By</b>: {user.userName}
                        </Typography>
                        <Typography variant="subtitle2">
                          <b>Status</b>:
                        </Typography>
                        <Chip
                          label={subtaskStatus.label}
                          color={subtaskStatus.color}
                          size="small"
                        />
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
          color="black"
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
