import { Route } from "react-router-dom";
//Enpoints for the API Calls
const RoutePaths = {
  //user management
  login: "/api/AuthManagement/login",
  registerUser: "/api/AuthManagement/register",
  getUserDetailsByuserId: "/api/AuthManagement/get-user-details-by-userId/",
  //task management
  createTask: "api/TaskManagement/create-task",
  updateTask: "/api/TaskManagement/update-task",
  deleteTask: "/api/TaskManagement/delete-task/",
  listOfTasks: "/api/TaskManagement/list-of-tasks",
  getTaskById: "/api/TaskManagement/get-task-by-id",
  getTasksByUserId: "/api/TaskManagement/get-list-of-users-task-by-userId/",
};
export default RoutePaths;
