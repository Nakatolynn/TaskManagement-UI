import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import TaskList from "./components/TaskTable";
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

function MainApp() {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [mode, setMode] = useState("list");
  const [editingTask, setEditingTask] = useState(null);

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

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <Container sx={{ mt: 3, mb: 3 }} maxWidth={false}>
          {mode === "list" && (
            <TaskList
              onOpenDetail={openDetail}
              onCreate={openCreate}
              onEdit={openEdit}
            />
          )}

          {mode === "detail" && (
            <TaskDetail
              id={selectedTaskId}
              onBack={backToList}
              onEdit={() => {}}
            />
          )}

          {(mode === "create" || mode === "edit") && (
            <TaskForm task={editingTask} onDone={backToList} />
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register onRegister={setUser} />} />
        <Route
          path="/*"
          element={user ? <MainApp /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}
