import RoutePaths from "../routes/TaskMgtRoutes";
import axiosService from "./axios";

const registerUser = async (formData) => {
  try {
    const response = await axiosService.post(RoutePaths.registerUser, formData);
    localStorage.setItem("user-details", JSON.stringify(response.data));
    //  alert("Registration successful!");
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error("error registering user", error);
    throw error;
  }
};

const login = async (formData) => {
  try {
    const response = await axiosService.post(RoutePaths.login, formData);
    const token = response.data.token;
    if (token) {
      localStorage.setItem("token", token);
    }

    return { data: response.data, status: response.status };
  } catch (error) {
    console.error("login failed", error);
    throw error;
  }
};
const getUserDetails = async (id, signal) => {
  try {
    const response = await axiosService.get(
      RoutePaths.getUserDetailsByuserId + id,
      { signal }
    );
    return response.data;
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Request was aborted");
    } else {
      console.error("Error fetching user details:", error);
    }
    return error;
  }
};

const LoginApis = {
  registerUser,
  login,
  getUserDetails,
};
export default LoginApis;
