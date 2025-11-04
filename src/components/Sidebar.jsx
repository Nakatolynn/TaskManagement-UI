import React, { useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { StackedBarChart, Logout } from "@mui/icons-material";
import { Divider, Menu, MenuItem } from "@mui/material";

export default function Sidebar({ user, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const items = [{ key: "dashboard", label: "Dashboard", icon: <HomeIcon /> }];

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    onLogout();
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        width: 280,
        bgcolor: "background.paper",
        height: "100vh",
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 12px rgba(0,0,0,0.04)",
      }}
    >
      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid",
          borderColor: "divider",
          cursor: "pointer",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
        onClick={handleProfileClick}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: "#1e3c72",
              width: 48,
              height: 48,
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
          >
            {user?.userName?.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <Box>
            <Typography variant="h6" color="#1e3c72" fontWeight="600">
              {user?.firstName || "User"} {user?.lastName || "User"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, py: 2 }}>
        <List>
          {items.map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  "&.Mui-selected": {
                    bgcolor: "#1e3c72",
                    color: "primary.contrastText",
                    "& .MuiListItemIcon-root": {
                      color: "primary.contrastText",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "text.secondary",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Logout Section */}
      <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: "error.main",
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              variant: "body2",
              fontWeight: 500,
            }}
          />
        </ListItemButton>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{
            color: "error.main",
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "inherit" }} />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
