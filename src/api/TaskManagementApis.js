import RoutePaths from "../routes/TaskMgtRoutes";
import axiosService from "./axios";

const BaseUrl = import.meta.env.VITE_APP_API_URL;
const createTask = async (formData) => {
  try {
    const response = await axiosService.post(
      BaseUrl + RoutePaths.createTask,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("error creating task", error);
    throw error;
  }
};

const getAllTasks = async (data, signal) => {
  try {
    const response = await axiosService.get(
      BaseUrl + RoutePaths.listOfTasks,
      data,
      { signal: signal }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching task list:", error);
    throw error;
  }
};

const updateTask = async (data, signal) => {
  try {
    const response = await axiosService.put(
      BaseUrl + RoutePaths.updateTask,
      data,
      { signal: signal }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};
const getTaskById = async (id, signal) => {
  try {
    const getCoiDeclarationUrl = `${BaseUrl}/${RoutePaths.getTaskById}?coiDeclarationId=${id}`;
    const response = await axiosServices.post(
      getCoiDeclarationUrl,
      {},
      { signal }
    );
    return response.data;
  } catch (error) {
    // Handle cancellation error if the request was aborted
    if (error.name === "AbortError") {
      console.log("Request was aborted");
    } else {
      console.error("Error fetching task:", error);
    }
    return error;
  }
};

const getTasksCreatedByUser = async (id, signal) => {
  try {
    const getCoiDeclarationUrl = `${BaseUrl}/${RoutePaths.getUserDetailsByuserId}?coiDeclarationId=${id}`;
    const response = await axiosServices.post(
      getCoiDeclarationUrl,
      {},
      { signal }
    );
    return response.data;
  } catch (error) {
    // Handle cancellation error if the request was aborted
    if (error.name === "AbortError") {
      console.log("Request was aborted");
    } else {
      console.error("Error fetching task:", error);
    }
    return error;
  }
};

const TaskManagementApis = {
  createTask,
  getAllTasks,
  updateTask,
  getTaskById,
  getTasksCreatedByUser
};
export default TaskManagementApis;
