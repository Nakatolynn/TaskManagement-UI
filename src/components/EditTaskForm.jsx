import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import { Save, Cancel } from "@mui/icons-material";
import TaskManagementApis from "../api/TaskManagementApis";

const STATUS_OPTIONS = [
  { value: 0, label: "Open" },
  { value: 1, label: "Pending" },
  { value: 2, label: "In Progress" },
  { value: 3, label: "In Review" },
  { value: 4, label: "Completed" },
  { value: 5, label: "Closed" },
];

export default function EditTaskForm({ taskDetails, onClose, onSuccess }) {
  const [formValues, setFormValues] = useState({
    taskName: taskDetails.taskName || "",
    description: taskDetails.description || "",
    dueDate: taskDetails.dueDate ? taskDetails.dueDate.split("T")[0] : "",
    status: taskDetails.status || 0,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updated = await TaskManagementApis.updateTask({
        ...taskDetails,
        ...formValues,
      });
      onSuccess(updated);
    } catch (err) {
      console.error("Failed to update task", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            name="taskName"
            label="Task Name"
            fullWidth
            value={formValues.taskName}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formValues.description}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="dueDate"
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formValues.dueDate}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formValues.status}
              onChange={handleChange}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button
          onClick={onClose}
          startIcon={<Cancel />}
          variant="outlined"
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
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          }}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
}
