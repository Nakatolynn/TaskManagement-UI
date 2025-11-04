import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/RegisterUser";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";
import { Fade, Slide, Paper, Chip } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TaskManagementApis from "./api/TaskManagementApis";
import UserTaskTable from "./tables/UserTaskTable";
import { CircularProgress } from "@mui/material";
import TaskDetailsPreview from "./components/TaskDetailsPreview";

function MainApp({ user, onLogout }) {
  // Add onLogout prop here
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [mode, setMode] = useState("list");
  const [editingTask, setEditingTask] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const { userId } = useParams();
  const [listofTasks, setListOfTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const result = await TaskManagementApis.getTasksCreatedByUser(
          user?.userId
        );
        setListOfTasks(result);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.userId) {
      fetchTasks();
    } else {
      setIsLoading(false);
    }

    return () => {
      controller.abort();
    };
  }, [user?.userId]);

  useEffect(() => {
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

  function backToList() {
    setMode("list");
    setSelectedTaskId(null);
    setEditingTask(null);
  }

  // Show loading state while user data is being verified
  if (!user?.userName) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #dcdee1ff 100%)",
        }}
      >
        <CircularProgress size={60} />
        <Typography sx={{ ml: 2 }}>Loading user data...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #dcdee1ff 100%)",
      }}
    >
      {/* Pass onLogout to Sidebar and Topbar */}
      <Sidebar user={user} onLogout={onLogout} />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Topbar user={user} onLogout={onLogout} />
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
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #2D3748, #4A5568)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mb: 1,
                }}
              >
                Welcome, {user.firstName} {user.lastName}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
              }}
            ></Box>
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
              {isLoading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height={200}
                >
                  <CircularProgress />
                  <Typography sx={{ ml: 2 }}>Loading tasks...</Typography>
                </Box>
              ) : mode === "list" ? (
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
                  <UserTaskTable tasks={listofTasks} user={user} />
                </Paper>
              ) : mode === "detail" ? (
                <Slide direction="left" in timeout={400}>
                  {/* <Box>
                    <TaskDetail
                      id={selectedTaskId}
                      onBack={backToList}
                      onEdit={() => {}}
                    />
                  </Box> */}
                </Slide>
              ) : (
                <Slide direction="up" in timeout={400}>
                  {/* <Paper
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
                  </Paper> */}
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user-details"));
    console.log("Stored user on app start:", storedUser);

    if (storedUser && storedUser.userId && storedUser.userName) {
      setUser(storedUser);
    } else {
      console.log("No valid user found in localStorage");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user-details", JSON.stringify(user));
      console.log("User saved to localStorage:", user);
    } else {
      localStorage.removeItem("user-details");
      localStorage.removeItem("token");
      console.log("User cleared from localStorage");
    }
  }, [user]);

  const handleLogout = () => {
    console.log("Logging out...");
    setUser(null);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <CircularProgress sx={{ color: "white" }} size={60} />
        <Typography sx={{ ml: 2, color: "white" }}>Loading app...</Typography>
      </Box>
    );
  }

  console.log("Current user state:", user);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={`/dashboard/${user.userId}`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={`/dashboard/${user.userId}`} replace />
            ) : (
              <Login onLogin={setUser} user={user} />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to={`/dashboard/${user.userId}`} replace />
            ) : (
              <Register onRegister={setUser} />
            )
          }
        />
        <Route
          path="/dashboard/:userId"
          element={
            user ? (
              <MainApp user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/*"
          element={
            user ? (
              <Navigate to={`/dashboard/${user.userId}`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/task-preview/:taskId"
          element={
            user ? (
              <TaskDetailsPreview user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}
