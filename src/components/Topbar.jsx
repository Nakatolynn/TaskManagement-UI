import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import { alpha, styled } from "@mui/material/styles";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Badge,
} from "@mui/material";
import { Logout, ExpandMore } from "@mui/icons-material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.06),
  "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.08) },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: { width: "auto" },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "20ch",
    [theme.breakpoints.up("md")]: { width: "30ch" },
  },
}));

export default function Topbar({ user, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    onLogout();
    handleMenuClose();
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Box sx={{ flexGrow: 1 }} />

        {/* User Profile Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={handleProfileMenuOpen}
            sx={{
              p: 0.5,
              borderRadius: 2,
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#1e3c72",
                width: 36,
                height: 36,
                fontSize: "0.875rem",
                fontWeight: "bold",
              }}
            >
              {user?.userName?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <ExpandMore
              sx={{ fontSize: 18, color: "text.secondary", ml: 0.5 }}
            />
          </IconButton>
        </Box>

        {/* Profile Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 200,
              borderRadius: 2,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              "& .MuiMenuItem-root": {
                py: 1.5,
                px: 2,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {/* <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">Profile</Typography>
            </ListItemText>
          </MenuItem> */}

          <MenuItem
            onClick={handleLogout}
            sx={{
              color: "error.main",
              "&:hover": {
                bgcolor: "error.light",
                color: "error.contrastText",
              },
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" sx={{ color: "inherit" }} />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Logout
              </Typography>
            </ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
