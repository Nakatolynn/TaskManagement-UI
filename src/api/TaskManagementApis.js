import RoutePaths from "../routes/TaskMgtRoutes";
import axiosService from "./axios";

const createTask = async (formData) => {
  try {
    const response = await axiosService.post(RoutePaths.createTask, formData);
    return response.data;
  } catch (error) {
    console.error("error creating task", error);
    throw error;
  }
};

const getAllTasks = async (data, signal) => {
  try {
    const response = await axiosService.get(RoutePaths.listOfTasks, data, {
      signal: signal,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching task list:", error);
    throw error;
  }
};

const updateTask = async (data) => {
  try {
    const response = await axiosService.put(RoutePaths.updateTask, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};
const getTaskById = async (id) => {
  try {
    const response = await axiosService.get(RoutePaths.getTaskById + `/${id}`);
    return response.data;
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Request was aborted");
    } else {
      console.error("Error fetching task:", error);
    }
    return error;
  }
};

const getTasksCreatedByUser = async (id) => {
  try {
    const response = await axiosService.get(RoutePaths.getTasksByUserId + id);
    return response.data;
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Request was aborted");
    } else {
      console.error("Error fetching task:", error);
    }
    return error;
  }
};

const deleteTask = async (id) => {
  try {
    const response = await axiosService.delete(RoutePaths.deleteTask + id);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
const TaskManagementApis = {
  createTask,
  getAllTasks,
  updateTask,
  getTaskById,
  getTasksCreatedByUser,
  deleteTask,
};
export default TaskManagementApis;
