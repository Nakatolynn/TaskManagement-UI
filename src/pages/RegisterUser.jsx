import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Fade,
  Zoom,
  CircularProgress,
  Divider,
  Avatar,
  Container,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  PersonOutline,
  LockOutlined,
  BadgeOutlined,
  ArrowBack,
  TaskAlt,
} from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import LoginApis from "../api/LoginApis";

const RegisterUser = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must not exceed 50 characters"),
    lastName: Yup.string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must not exceed 50 characters"),
    username: Yup.string()
      .min(4, "Username must be at least 4 characters")
      .max(20, "Username must not exceed 20 characters")
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .required("Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .max(30, "Password must not exceed 30 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .required("Password is required"),
  });

  const initialValues = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setSubmitting(true);
    try {
      const response = await LoginApis.registerUser(values);
      console.log(
        "Register response status:",
        response.status,
        "data:",
        response.data
      );

      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
      if (response.status === 202) {
        setSnackbar({
          open: true,
          message: "Registration accepted (202).",
          severity: "info",
        });
      } else if (response.status >= 200 && response.status < 300) {
        setSnackbar({
          open: true,
          message: "Registration successful! Redirecting...",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: `Unexpected status: ${response.status}`,
          severity: "warning",
        });
      }

      resetForm();
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Registration failed:", error);

      let errorMessage = "Registration failed. Please try again.";
      if (error?.response?.data?.message)
        errorMessage = error.response.data.message;
      else if (error?.response?.status === 400)
        errorMessage = "User already exists.";
      else if (error?.message) errorMessage = error.message;

      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

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
            "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)",
        },
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          right: "10%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "10%",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.05)",
          animation: "float 6s ease-in-out infinite 1s",
        }}
      />

      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Header Section */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Zoom in timeout={600}>
                <Avatar
                  sx={{
                    m: "0 auto 16px",
                    bgcolor: "#1e3c72",
                    width: 70,
                    height: 70,
                    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                  }}
                >
                  <PersonAdd sx={{ fontSize: 32 }} />
                </Avatar>
              </Zoom>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  background:
                    "linear-gradient(135deg, #1e3c72 0%, #1e3c72 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mb: 1,
                }}
              >
                Create Account
              </Typography>
            </Box>

            {/* Back to Login */}
            <Box sx={{ mb: 3 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate("/login")}
                sx={{
                  color: "#1e3c72",
                  textTransform: "none",
                  fontWeight: "500",
                }}
              >
                Back to Login
              </Button>
            </Box>

            <Formik
              initialValues={initialValues}
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
                <Form>
                  <Stack spacing={3}>
                    {/* Name Fields in Row on larger screens */}
                    <Box sx={{ display: { xs: "block", sm: "flex" }, gap: 2 }}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                      />
                      <Field
                        as={TextField}
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                        //
                      />
                    </Box>

                    <Field
                      as={TextField}
                      fullWidth
                      label="Username"
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.username && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                    />

                    <Field
                      as={TextField}
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                    />

                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "grey.50",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "grey.200",
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight="bold"
                        color="text.secondary"
                        display="block"
                        gutterBottom
                      >
                        Password must contain:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {[
                          "6+ characters",
                          "1 uppercase",
                          "1 lowercase",
                          "1 number",
                        ].map((req, index) => (
                          <Typography
                            key={index}
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            • {req}
                          </Typography>
                        ))}
                      </Box>
                    </Box>

                    <Button
                      type="submit"
                      variant="contained"
                      size="medium"
                      disabled={isSubmitting}
                      fullWidth
                      sx={{ color: "#1e3c72" }}
                    >
                      {isSubmitting ? (
                        <CircularProgress size={24} sx={{ color: "#1e3c72" }} />
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>

            {/* Footer */}
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                }}
              >
                <TaskAlt color="primary" sx={{ fontSize: 16 }} />
                Already have an account?{" "}
                <Button
                  onClick={() => navigate("/login")}
                  sx={{
                    color: "#1e3c72",
                    fontWeight: "bold",
                    textTransform: "none",
                    minWidth: "auto",
                    p: 0,
                    ml: 0.5,
                  }}
                >
                  Sign in
                </Button>
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === "success" ? 2000 : 6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterUser;
