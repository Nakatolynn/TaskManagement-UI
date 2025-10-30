import React from "react";
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Description,
  Title,
  Assignment,
  Schedule,
  Person,
  Save,
  Cancel,
  AddTask,
  Edit,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";

// user statuses
const STATUS_OPTIONS = [
  { value: 0, label: "Pending", color: "default", icon: "⏳" },
  { value: 1, label: "In Progress", color: "primary", icon: "🚧" },
  { value: 2, label: "In Review", color: "warning", icon: "👀" },
  { value: 3, label: "Completed", color: "success", icon: "✅" },
  { value: 4, label: "Closed", color: "success", icon: "✅" },
];

const validationSchema = Yup.object({
  taskName: Yup.string()
    .required("Task name is required")
    .min(3, "Task name must be at least 3 characters")
    .max(100, "Task name must be less than 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  status: Yup.number()
    .required("Status is required")
    .min(0, "Invalid status")
    .max(3, "Invalid status"),
});

export default function TaskForm({ task, onDone, userId }) {
  const isEditing = Boolean(task?.taskId);

  const formik = useFormik({
    initialValues: {
      taskName: task?.taskName || "",
      description: task?.description || "",
      status: task?.status ?? 0,
      userId: userId || "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getStatusInfo = (statusValue) => {
    return (
      STATUS_OPTIONS.find((option) => option.value === statusValue) ||
      STATUS_OPTIONS[0]
    );
  };

  const currentStatus = getStatusInfo(formik.values.status);

  return (
    <Fade in timeout={500}>
      <Box sx={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
              <Typography variant="h4" component="h1" fontWeight="bold">
                {isEditing ? "Edit Task" : "Create New Task"}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
                {isEditing
                  ? "Update your task details below"
                  : "Fill in the details to create a new task"}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Form Section */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                borderRadius: 3,
                background: "white",
              }}
            >
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                  {/* Task Name */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="taskName"
                      name="taskName"
                      label="Task Name"
                      value={formik.values.taskName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.taskName &&
                        Boolean(formik.errors.taskName)
                      }
                      helperText={
                        formik.touched.taskName && formik.errors.taskName
                      }
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Title color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "grey.50",
                        },
                      }}
                    />
                  </Grid>

                  {/* Description */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="description"
                      name="description"
                      label="Description"
                      multiline
                      rows={4}
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.description &&
                        Boolean(formik.errors.description)
                      }
                      helperText={
                        formik.touched.description && formik.errors.description
                          ? formik.errors.description
                          : `${formik.values.description.length}/500 characters`
                      }
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{ alignSelf: "flex-start", mt: 1.5 }}
                          >
                            <Description color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "grey.50",
                        },
                      }}
                    />
                  </Grid>

                  {/* Status */}
                  <Grid item xs={12}>
                    <FormControl
                      fullWidth
                      error={
                        formik.touched.status && Boolean(formik.errors.status)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "grey.50",
                        },
                      }}
                    >
                      <InputLabel id="status-label">Status</InputLabel>
                      <Select
                        labelId="status-label"
                        id="status"
                        name="status"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Status"
                        startAdornment={
                          <InputAdornment position="start" sx={{ ml: 1 }}>
                            <Assignment color="action" />
                          </InputAdornment>
                        }
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <span>{option.icon}</span>
                              <span>{option.label}</span>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.status && formik.errors.status && (
                        <FormHelperText>{formik.errors.status}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Action Buttons */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "flex-end",
                        pt: 2,
                      }}
                    >
                      <Button
                        type="button"
                        variant="outlined"
                        size="large"
                        onClick={onDone}
                        startIcon={<Cancel />}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          px: 4,
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={formik.isSubmitting}
                        startIcon={
                          formik.isSubmitting ? <Schedule /> : <Save />
                        }
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          px: 4,
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        {formik.isSubmitting
                          ? "Saving..."
                          : isEditing
                          ? "Update Task"
                          : "Create Task"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* Preview Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: "sticky", top: 20 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: "white",
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Task Preview
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {/* Task Preview Card */}
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    border: "2px solid",
                    borderColor: "grey.200",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent>
                    {/* Status Chip */}
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={currentStatus.label}
                        color={currentStatus.color}
                        icon={<span>{currentStatus.icon}</span>}
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>

                    {/* Task Name */}
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {formik.values.taskName || "Your Task Name"}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {formik.values.description ||
                        "Task description will appear here..."}
                    </Typography>

                    {/* Metadata */}
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Person
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Assigned to: {userId ? "You" : "Not assigned"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Schedule
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Created: {isEditing ? "Editing" : "New"}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: "grey.50",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Form Status
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Chip
                      label={formik.isValid ? "Valid" : "Invalid"}
                      color={formik.isValid ? "success" : "error"}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={formik.dirty ? "Unsaved changes" : "No changes"}
                      color={formik.dirty ? "warning" : "default"}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
}
