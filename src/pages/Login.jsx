import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import LoginApis from "../api/LoginApis";
import {
  Avatar,
  Button,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  Alert,
  Fade,
  Zoom,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  PersonOutline,
  TaskAlt,
} from "@mui/icons-material";

const validationSchema = Yup.object().shape({
  userName: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(30, "Password must not exceed 30 characters"),
});

export default function Login({ onLogin, user }) {
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  async function handleSubmit(values, { setSubmitting }) {
    setError(null);
    setIsLoading(true);

    try {
      const { data } = await LoginApis.login(values);

      const userData = {
        userId: data.userId,
        userName: data.username,
        token: data.token,
      };
      localStorage.setItem("user-details", JSON.stringify(userData));
      onLogin && onLogin(userData);
      navigate(`/dashboard/${userData.userId}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e3c72 0%, #1e3c72 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 30% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)",
        },
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          right: "15%",
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.05)",
          animation: "float 8s ease-in-out infinite 1s",
        }}
      />

      <Fade in timeout={800}>
        <Paper
          elevation={24}
          sx={{
            p: { xs: 3, sm: 4 },
            minWidth: 320,
            maxWidth: 420,
            width: "90%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: 4,
            border: "1px solid rgba(255, 255, 255, 0.2)",
            position: "relative",
            zIndex: 1,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Zoom in timeout={600}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Avatar
                sx={{
                  m: "0 auto 16px",
                  bgcolor: "primary.main",
                  width: 60,
                  height: 60,
                  boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
                }}
              >
                <LockOutlined sx={{ fontSize: 30 }} />
              </Avatar>
              {/* <Typography
                component="h1"
                variant="h4"
                fontWeight="bold"
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mb: 1,
                }}
              >
                Welcome Back
              </Typography> */}
              <Typography variant="body2" color="#1e3c72" sx={{ opacity: 0.8 }}>
                Sign into Task Management
              </Typography>
            </Box>
          </Zoom>

          {/* Error Alert */}
          {error && (
            <Fade in>
              <Alert
                severity="error"
                sx={{
                  mt: 2,
                  width: "100%",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "error.light",
                }}
              >
                {error}
              </Alert>
            </Fade>
          )}

          {/* Login Form */}
          <Formik
            initialValues={{ userName: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              isSubmitting,
              errors,
              touched,
              handleChange,
              handleBlur,
              values,
            }) => (
              <Form style={{ width: "100%" }}>
                <Box sx={{ mb: 2 }}>
                  <Field
                    as={TextField}
                    margin="normal"
                    required
                    fullWidth
                    id="userName"
                    label="Username"
                    name="userName"
                    autoComplete="username"
                    autoFocus
                    error={touched.userName && Boolean(errors.userName)}
                    helperText={touched.userName && errors.userName}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover fieldset": {
                          borderColor: "#1e3c72",
                        },
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 1 }}>
                  <Field
                    as={TextField}
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover fieldset": {
                          borderColor: "#1e3c72",
                        },
                      },
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting || isLoading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: "1rem",
                    fontWeight: "bold",
                    textTransform: "none",
                    background:
                      "linear-gradient(135deg, #1e3c72 0%, #1e3c72 100%)",
                  }}
                >
                  {isSubmitting || isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Don't have an account?
                  </Typography>
                  <Link
                    href="/register"
                    variant="body2"
                    sx={{
                      color: "#1e3c72",
                      fontWeight: "bold",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Create new account
                  </Link>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Fade>

      {/* Global Styles for Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
        `}
      </style>
    </Box>
  );
}
