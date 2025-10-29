import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import InboxIcon from "@mui/icons-material/Inbox";
import ArticleIcon from "@mui/icons-material/Article";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WidgetsIcon from "@mui/icons-material/Widgets";

export default function Sidebar() {
  const items = [
    { key: "home", label: "Home", icon: <HomeIcon /> },
    { key: "inbox", label: "Inbox", icon: <InboxIcon /> },
    { key: "dashboards", label: "Dashboards", icon: <DashboardIcon /> },
  ];

  return (
    <Box
      sx={{
        width: 260,
        bgcolor: "background.paper",
        height: "100vh",
        borderRight: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
        <Avatar sx={{ bgcolor: "primary.main" }}>L</Avatar>
        <Box>
          <Typography variant="subtitle1">Your Workspace</Typography>
          <Typography variant="caption" color="text.secondary">
            Personal
          </Typography>
        </Box>
      </Box>
      <List>
        {items.map((i) => (
          <ListItem key={i.key} disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{ color: "text.secondary" }}>
                {i.icon}
              </ListItemIcon>
              <ListItemText
                primary={i.label}
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
