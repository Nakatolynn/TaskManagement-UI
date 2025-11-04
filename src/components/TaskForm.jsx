import React, { useState } from "react";
import {
  Box,
  Button,
  Fade,
  Grid,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Zoom,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Divider,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  AddTask,
  Edit,
  Title,
  Description,
  Assignment,
  Schedule,
  Save,
  Cancel,
  Delete,
  Add,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import TaskManagementApis from "../api/TaskManagementApis";
import { useNavigate } from "react-router-dom";

const STATUS_OPTIONS = [
  { label: "Open", value: 0 },
  { label: "Pending", value: 1 },
  { label: "In Progress", value: 2 },
  { label: "In Review", value: 3 },
  { label: "Completed", value: 4 },
  { label: "Closed", value: 5 },
];

export default function TaskForm({
  isEditing = false,
  initialData = {},
  onSubmit,
  onClose,
  user,
}) {
  const [subTasks, setSubTasks] = useState(initialData.subTasks || []);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [noOfPreviousChanges, setNoOfChangesOnTask] = useState(0);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      taskName: initialData.taskName || "",
      description: initialData.description || "",
      dueDate: initialData.dueDate || "",
      isComplete: initialData.isComplete || false,
      status: initialData.status ?? 0,
      userId: user?.userId,
      createdByUser: user?.userName,
    },
    validationSchema: Yup.object({
      taskName: Yup.string().required("Task Name is required"),
      description: Yup.string().max(500, "Max 500 characters allowed"),
      dueDate: Yup.date().nullable(),
      status: Yup.number().required("Status is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);
      const fullTask = {
        ...values,
        subTasks,
      };

      TaskManagementApis.createTask(fullTask)
        .then((result) => {
          if (result) {
            setSnackbarMessage("Task Added Successfully.");
            setSnackbarOpen(true);
            setNoOfChangesOnTask((prev) => prev + 1);
            window.location.reload();
            navigate(`/dashboard/${user?.userId}`);
            if (onSubmit) {
              onSubmit(fullTask);
            }
          }
        })
        .catch((error) => {
          setSnackbarMessage("Failed to create task. Please try again.");
          setSnackbarOpen(true);
          console.error("Error creating task:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  const handleAddSubTask = () => {
    setSubTasks([
      ...subTasks,
      {
        taskName: "",
        description: "",
        dueDate: "",
        status: 0,
        userId: user?.userId,
      },
    ]);
  };

  const handleSubTaskChange = (index, field, value) => {
    const updated = [...subTasks];
    updated[index][field] = value;
    setSubTasks(updated);
  };

  const handleRemoveSubTask = (index) => {
    setSubTasks(subTasks.filter((_, i) => i !== index));
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  console.log("user", user?.userId);
  return (
    <Fade in timeout={500}>
      <Box sx={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
            color: "white",
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Zoom in timeout={600}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                }}
              >
                {isEditing ? <Edit /> : <AddTask />}
              </Box>
            </Zoom>
            <Box>
              <Typography variant="h6" component="h1" fontWeight="bold">
                {isEditing ? "Edit Task" : "Create New Task"}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
                {isEditing
                  ? "Modify existing task details below"
                  : "Provide all necessary details to create a new task."}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Form Section */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Create Task Form
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                  {/* Task Title */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="taskName"
                      name="taskName"
                      label="Task Name"
                      value={formik.values.taskName}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.taskName &&
                        Boolean(formik.errors.taskName)
                      }
                      helperText={
                        formik.touched.taskName && formik.errors.taskName
                      }
                    />
                  </Grid>

                  {/* Description */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="description"
                      name="description"
                      label="Task Description"
                      multiline
                      rows={3}
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.description &&
                        Boolean(formik.errors.description)
                      }
                      helperText={
                        formik.touched.description && formik.errors.description
                          ? formik.errors.description
                          : `${formik.values.description.length}/500 characters`
                      }
                    />
                  </Grid>

                  {/* Status & Due Date */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        id="status"
                        name="status"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        label="Status"
                        error={
                          formik.touched.status && Boolean(formik.errors.status)
                        }
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="dueDate"
                      name="dueDate"
                      label="Due Date"
                      type="date"
                      value={formik.values.dueDate}
                      onChange={formik.handleChange}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Schedule color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Subtasks Section */}
                <Divider sx={{ my: 4 }} />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Subtasks
                  </Typography>
                  <Tooltip title="Add Subtask">
                    <IconButton
                      color="primary"
                      onClick={handleAddSubTask}
                      sx={{
                        border: "1px solid #ccc",
                        "&:hover": { backgroundColor: "#e3f2fd" },
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Tooltip>
                </Box>

                {subTasks.length === 0 && (
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    No subtasks added yet. Click the "+" button to create one.
                  </Typography>
                )}

                {subTasks.map((subTask, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      mt: 2,
                      borderRadius: 2,
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={11}>
                        <TextField
                          fullWidth
                          label="Subtask Title"
                          value={subTask.taskName}
                          onChange={(e) =>
                            handleSubTaskChange(
                              index,
                              "taskName",
                              e.target.value
                            )
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Assignment color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Subtask Description"
                          sx={{ mt: 1 }}
                          value={subTask.description}
                          onChange={(e) =>
                            handleSubTaskChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              type="date"
                              label="Due Date"
                              InputLabelProps={{ shrink: true }}
                              value={subTask.dueDate}
                              onChange={(e) =>
                                handleSubTaskChange(
                                  index,
                                  "dueDate",
                                  e.target.value
                                )
                              }
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <InputLabel>Status</InputLabel>
                              <Select
                                value={subTask.status || ""}
                                label="Status"
                                onChange={(e) =>
                                  handleSubTaskChange(
                                    index,
                                    "status",
                                    e.target.value
                                  )
                                }
                              >
                                {STATUS_OPTIONS.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Tooltip title="Remove Subtask">
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveSubTask(index)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}

                <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={loading}
                    sx={{
                      background:
                        "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                    }}
                  >
                    {loading
                      ? "Saving..."
                      : isEditing
                      ? "Update Task"
                      : "Create Task"}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
}
