import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import TaskDetail from "./components/TaskDetail";
import TaskForm from "./components/TaskForm";
import Login from "./pages/Login";
import Register from "./pages/RegisterUser";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import TaskTable from "./tables/TaskTable";
import { Typography } from "@mui/material";
import { Fade, Slide, Paper, Chip, Breadcrumbs } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TaskManagementApis from "./api/TaskManagementApis";
import UserTaskTable from "./tables/UserTaskTable";
function MainApp({ user }) {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [mode, setMode] = useState("list");
  const [editingTask, setEditingTask] = useState(null);
  const [userDetails, setStoredUserDetails] = useState();
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const { userId } = useParams();
  const [listofTasks, setListOfTasks] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchTasks = async () => {
      try {
        const result = await TaskManagementApis.getTasksCreatedByUser(
          user?.userId
        );
        setListOfTasks(result);
      } catch (error) {
        if (error.name === "AbortError") {
          console.error(error);
        } else {
          console.error(error);
        }
      }
    };

    fetchTasks();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const storedUserDetails = JSON.parse(localStorage.getItem("user-details"));
    setStoredUserDetails(storedUserDetails);
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

  function openDetail(id) {
    setSelectedTaskId(id);
    setMode("detail");
  }

  function openCreate() {
    setEditingTask(null);
    setMode("create");
  }

  function openEdit(task) {
    setEditingTask(task);
    setMode("edit");
    setSelectedTaskId(task.id);
  }

  function backToList() {
    setMode("list");
    setSelectedTaskId(null);
    setEditingTask(null);
  }
  console.log("tasks", listofTasks);
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #dcdee1ff 100%)",
      }}
    >
      <Sidebar user={user} />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Topbar />
        <Box
          sx={{
            mb: 4,
            px: 3,
            pt: 2,
            background: "linear-gradient(90deg, #ffffff 0%, #96b4d2ff 100%)",
            borderBottom: "1px solid",
            borderColor: "divider",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #2D3748, #4A5568)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mb: 1,
                }}
              >
                {greeting}, {user?.userName || "Guest"} 👋
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTimeIcon
                  sx={{ fontSize: 16, color: "text.secondary" }}
                />
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  {currentTime}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Chip
                label="Ready to work"
                color="success"
                variant="outlined"
                size="small"
              />
              <Chip
                label={`Last active: ${new Date().toLocaleDateString()}`}
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        </Box>
        <Container
          sx={{
            flex: 1,
            py: 3,
            overflow: "auto",
            transition: "all 0.3s ease-in-out",
          }}
          maxWidth={false}
        >
          <Fade in timeout={500}>
            <Box>
              {mode === "list" && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    background: "white",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* <TaskTable
                    onOpenDetail={openDetail}
                    onCreate={openCreate}
                    onEdit={openEdit}
                    user={user}
                  /> */}
                  <UserTaskTable
                    tasks={listofTasks}
                    // onView={handleView}
                    // onEdit={handleEdit}
                  />
                </Paper>
              )}

              {mode === "detail" && (
                <Slide direction="left" in timeout={400}>
                  <Box>
                    <TaskDetail
                      id={selectedTaskId}
                      onBack={backToList}
                      onEdit={() => {}}
                    />
                  </Box>
                </Slide>
              )}

              {(mode === "create" || mode === "edit") && (
                <Slide direction="up" in timeout={400}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      background: "white",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    }}
                  >
                    <TaskForm task={editingTask} onDone={backToList} />
                  </Paper>
                </Slide>
              )}
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user-details"));
    if (storedUser) setUser(storedUser);
  }, []);

  if (user === null) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={setUser} user={user} />}
        />
        <Route path="/register" element={<Register onRegister={setUser} />} />
        <Route path="/home/:userId" element={<MainApp user={user} />} />
        <Route
          path="/*"
          element={<Navigate to={`/home/${user.userId}`} replace />}
        />
      </Routes>
    </Router>
  );
}
