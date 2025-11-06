import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Chip,
  TextField,
  Box,
  Typography,
  IconButton,
  Tooltip,
  InputAdornment,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
} from "@mui/material";
import AddTaskIcon from "@mui/icons-material/AddTask";
import {
  Search,
  FilterList,
  Edit,
  Visibility,
  Delete,
} from "@mui/icons-material";
import TaskForm from "../components/CreateTaskForm";
import TaskDetailsPreview from "../components/TaskDetailsPreview";
import TaskManagementApis from "../api/TaskManagementApis";
import { useNavigate } from "react-router-dom";
const STATUS_MAP = {
  0: { label: "Not Done", color: "default" },
  1: { label: "Pending", color: "info" },
  2: { label: "In Progress", color: "primary" },
  3: { label: "In Review", color: "warning" },
  4: { label: "Completed", color: "success" },
  5: { label: "Closed", color: "secondary" },
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
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

export default function UserTaskTable({
  tasks = [],
  onView,
  onEdit,
  user,
  loading = false,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [searchTerm, setSearchTerm] = useState("");
  const tasksData = Array.isArray(tasks) ? tasks : [];
  const [openTaskForm, setOpenTaskForm] = useState(false);
  const [taskDetails, setTaskDetails] = useState(false);
  const handleOpen = () => setOpenTaskForm(true);
  const handleClose = () => setOpenTaskForm(false);
  const handleOpenDetails = () => setTaskDetails(true);
  const handleCloseDetails = () => setTaskDetails(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [noOfPreviousChanges, setNoOfChangesOnTask] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const navigate = useNavigate();

  const processedTasks = useMemo(() => {
    let filteredTasks = tasksData;

    if (searchTerm) {
      filteredTasks = tasksData.filter(
        (task) =>
          task.taskName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          STATUS_MAP[task.status]?.label
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filteredTasks.sort((a, b) => {
      let aValue = a[orderBy] || "";
      let bValue = b[orderBy] || "";

      if (orderBy === "createdAt" || orderBy === "updatedAt") {
        aValue = new Date(aValue).getTime() || 0;
        bValue = new Date(bValue).getTime() || 0;
      }

      if (orderBy === "status") {
        aValue = STATUS_MAP[a.status]?.label || "";
        bValue = STATUS_MAP[b.status]?.label || "";
      }

      if (order === "desc") {
        return aValue < bValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
  }, [tasksData, searchTerm, order, orderBy]);

  // Paginated tasks
  const paginatedTasks = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return processedTasks.slice(startIndex, startIndex + rowsPerPage);
  }, [processedTasks, page, rowsPerPage]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const columns = [
    { id: "taskName", label: "Task Name", sortable: true, minWidth: 150 },
    { id: "description", label: "Description", sortable: true, minWidth: 200 },
    { id: "status", label: "Status", sortable: true, minWidth: 120 },
    { id: "createdAt", label: "Created", sortable: true, minWidth: 150 },
    { id: "CreatedBy", label: "Created By", sortable: true, minWidth: 150 },
    { id: "actions", label: "Actions", sortable: false, minWidth: 100 },
  ];

  // Loading state
  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading tasks...
        </Typography>
      </Paper>
    );
  }

  const handleDeleteTask = (id) => {
    return TaskManagementApis.deleteTask(id)
      .then((result) => {
        if (result) {
          setSnackbarMessage("Task deleted successfully.");
          setSnackbarOpen(true);
          setNoOfChangesOnTask((prev) => prev + 1);
          navigate(`/dashboard/${user.userId}`);
        }
        return result;
      })
      .catch((error) => {
        setSnackbarMessage("Failed to delete task. Please try again.");
        setSnackbarOpen(true);
        console.error("Error deleting task:", error);
        throw error;
      });
  };

  console.log("User-Id:", user);
  console.log("selected:", selectedTask);

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        background: "white",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      }}
    >
      <Box
        sx={{
          p: 4,
          pb: 3,
          background: "linear-gradient(135deg, #1e3c72  0%, #1e3c72  100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "100%",
            background:
              "radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 70%)",
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 1,
              background: "linear-gradient(45deg, #ffffff, #e3f2fd)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Task Management Application
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              fontWeight: 400,
              mb: 3,
            }}
          >
            Manage and track all your tasks in one place
          </Typography>

          {/* Stats Cards */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box
              sx={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: 2,
                p: 2,
                minWidth: "120px",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                {tasksData.length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Tasks
              </Typography>
            </Box>
            <Box
              sx={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: 2,
                p: 2,
                minWidth: "120px",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                {processedTasks.length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Filtered
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: 3, pb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: 700, mb: 0.5 }}
            >
              Task List
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Showing <strong>{paginatedTasks.length}</strong> of{" "}
              <strong>{processedTasks.length}</strong> tasks
            </Typography>
          </Box>

          <Button
            variant="contained"
            //color="primary"
            startIcon={<AddTaskIcon />}
            onClick={handleOpen}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              px: 4,
              py: 1.2,
              fontSize: "1rem",
              background: "linear-gradient(135deg, #1e3c72  0%, #1e3c72  100%)",
            }}
          >
            Create New Task
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search tasks by name, description, or status..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "10px",
                backgroundColor: "grey.50",
                "&:hover": {
                  backgroundColor: "grey.100",
                },
                "&.Mui-focused": {
                  backgroundColor: "white",
                  boxShadow: "0 0 0 2px rgba(102, 126, 234, 0.2)",
                },
              },
            }}
            sx={{
              maxWidth: "400px",
              flex: 1,
              minWidth: "300px",
            }}
          />

          {/* Quick Status Filters */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label="All"
              variant={searchTerm === "" ? "filled" : "outlined"}
              onClick={() => setSearchTerm("")}
              color="primary"
              size="small"
              sx={{ borderRadius: "8px" }}
            />
            {Object.entries(STATUS_MAP).map(([key, status]) => (
              <Chip
                key={key}
                label={status.label}
                variant="outlined"
                onClick={() => setSearchTerm(status.label)}
                size="small"
                sx={{ borderRadius: "8px" }}
              />
            ))}
          </Box>

          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}
          >
            <FilterList color="action" />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {processedTasks.length} results
            </Typography>
          </Box>
        </Box>
      </Box>
      <TableContainer
        sx={{
          maxHeight: 600,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Table stickyHeader aria-label="tasks table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    minWidth: column.minWidth,
                    backgroundColor: "grey.50",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    py: 2.5,
                    borderBottom: "2px solid",
                    borderColor: "divider",
                    "&:first-of-type": {
                      borderTopLeftRadius: "0px",
                    },
                    "&:last-of-type": {
                      borderTopRightRadius: "0px",
                    },
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleSort(column.id)}
                      sx={{
                        fontWeight: 700,
                        "&:hover": {
                          color: "primary.main",
                          "& .MuiTableSortLabel-icon": {
                            color: "primary.main !important",
                          },
                        },
                      }}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedTasks.length > 0 ? (
              paginatedTasks.map((task, index) => (
                <TableRow
                  key={task.taskId}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "action.hover",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                    backgroundColor:
                      index % 2 === 0 ? "transparent" : "grey.50",
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                >
                  <TableCell sx={{ py: 2.5 }}>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{ fontSize: "0.9rem" }}
                    >
                      {task.taskName || "Unnamed Task"}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 2.5 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontSize: "0.875rem",
                        lineHeight: 1.4,
                      }}
                    >
                      {task.description || "No description provided"}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 2.5 }}>
                    <Chip
                      label={STATUS_MAP[task.status]?.label || "Unknown"}
                      color={STATUS_MAP[task.status]?.color || "default"}
                      size="small"
                      variant="filled"
                      sx={{
                        fontWeight: 600,
                        minWidth: "100px",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ py: 2.5 }}>
                    <Typography
                      variant="body2"
                      fontSize="0.8rem"
                      color="text.secondary"
                    >
                      {formatDate(task.createdAt)}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 2.5 }}>
                    <Typography
                      variant="body2"
                      fontSize="0.8rem"
                      color="text.secondary"
                    >
                      {user.userName}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 2.5 }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="View Details" arrow>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            sessionStorage.setItem(
                              "selectedTask",
                              JSON.stringify(task)
                            );
                            navigate(`/task-preview/${task.taskId}`);
                          }}
                          sx={{
                            backgroundColor: "primary.light",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "primary.main",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                            borderRadius: "8px",
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Task" arrow>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setTaskToDelete(task.taskId);
                            setConfirmDialogOpen(true);
                          }}
                          sx={{
                            backgroundColor: "error.light",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "error.main",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                            borderRadius: "8px",
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 6 }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {searchTerm
                        ? "No matching tasks found"
                        : "No tasks created yet"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3, maxWidth: "400px", mx: "auto" }}
                    >
                      {searchTerm
                        ? "Try adjusting your search criteria or filters to find what you're looking for."
                        : "Get started by creating your first task to organize your work efficiently."}
                    </Typography>
                    {!searchTerm && (
                      <Button
                        variant="contained"
                        // color="#1e3c7"
                        startIcon={<AddTaskIcon />}
                        onClick={handleOpen}
                        sx={{
                          borderRadius: "10px",
                          textTransform: "none",
                          fontWeight: 600,
                          px: 4,
                          background:
                            "linear-gradient(135deg, #1e3c72  0%, #1e3c72  100%)",
                        }}
                      >
                        Create Your First Task
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {processedTasks.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={processedTasks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: 1,
            borderColor: "divider",
            backgroundColor: "grey.50",
            "& .MuiTablePagination-toolbar": {
              minHeight: "60px",
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                fontWeight: 500,
              },
          }}
        />
      )}
      {openTaskForm && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogContent dividers>
            <TaskForm onClose={handleClose} user={user} />
          </DialogContent>
        </Dialog>
      )}

      {selectedTask && (
        <TaskDetailsPreview
          onClose={handleCloseDetails}
          user={user}
          tasks={selectedTask}
        />
      )}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Task Deletion</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to delete this task? This action cannot be
            undone. All the SubTasks Under it will be deleted as Well
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              onClick={() => setConfirmDialogOpen(false)}
              variant="outlined"
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDeleteTask(taskToDelete)
                  .then(() => {
                    setSnackbarMessage("Task deleted successfully!");
                    setSnackbarOpen(true);
                    setConfirmDialogOpen(false);
                    setTimeout(() => {
                      window.location.reload();
                    }, 1500);
                  })
                  .catch(() => {
                    setSnackbarMessage(
                      "Failed to delete task. Please try again."
                    );
                    setSnackbarOpen(true);
                    setConfirmDialogOpen(false);
                  });
              }}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
