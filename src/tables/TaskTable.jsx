import React, { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../api/client";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Button,
  Box,
  CircularProgress,
  Alert,
  Stack,
  Typography,
  Fade,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddTaskIcon from "@mui/icons-material/AddTask";
import TaskManagementApis from "../api/TaskManagementApis";
import { useParams } from "react-router-dom";

export default function TaskTable({ onOpenDetail, onCreate, onEdit, user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loggedUser, setLoggedUser] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const { id } = useParams();
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setLoggedUser(storedUser);
    const now = new Date();
    const ugandaTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Africa/Kampala" })
    );

    const hour = ugandaTime.getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

    const formatted = ugandaTime.toLocaleString("en-UG", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setCurrentTime(formatted);
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await TaskManagementApis.getTasksCreatedByUser(user?.userId);
      console.log("Tasks for user:", data);
      setTasks(data || []);
    } catch (e) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks((t) => t.filter((x) => x.id !== id));
    } catch (e) {
      alert("Delete failed: " + (e.message || e));
    }
  }

  return (
    <Fade in timeout={700}>
      <Box sx={{ p: 2 }}>
        {/* Action Bar */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Your Tasks{JSON.stringify(user)}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={onCreate}
            startIcon={<AddTaskIcon />}
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
            }}
          >
            Create New Task
          </Button>
        </Stack>

        {/* Loading & Error States */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Task Grid */}
        {!loading && !error && (
          <Grid container spacing={2}>
            {tasks.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary">
                  No tasks found. Click “New Task” to create one.
                </Typography>
              </Grid>
            ) : (
              tasks.map((task) => (
                <Grid item key={task.id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    elevation={3}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent
                      sx={{ flex: 1, cursor: "pointer" }}
                      onClick={() => onOpenDetail(task.id)}
                    >
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        {task.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {task.description}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={task.status || "todo"}
                          color={
                            task.status === "completed"
                              ? "success"
                              : task.status === "in progress"
                              ? "warning"
                              : "default"
                          }
                          size="small"
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: "auto" }}
                        >
                          {task.dueDate || ""}
                        </Typography>
                      </Stack>
                    </CardContent>
                    <CardActions>
                      <Box sx={{ flexGrow: 1 }} />
                      <IconButton
                        size="small"
                        onClick={() => onEdit(task)}
                        aria-label="edit"
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(task.id)}
                        aria-label="delete"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {/* Refresh Button */}
        <Box mt={3} textAlign="center">
          <Button variant="outlined" onClick={load}>
            Refresh
          </Button>
        </Box>
      </Box>
    </Fade>
  );
}
