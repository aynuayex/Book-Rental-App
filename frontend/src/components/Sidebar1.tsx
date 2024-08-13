import CssBaseline from "@mui/material/CssBaseline";
import {
  Drawer,
  Grid,
  Divider,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import book3 from "../assets/book3.png";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const drawerWidth = 279;

const list1 = [
  { text: "Dashboard", icon: <DashboardOutlinedIcon /> },
  { text: "Books", icon: <LibraryBooksOutlinedIcon /> },
  { text: "Owners", icon: <PersonOutlinedIcon /> },
  { text: "Other", icon: <AddCircleOutlineOutlinedIcon /> },
  { text: "Other One", icon: <AddCircleOutlineOutlinedIcon /> },
];

const list2 = [
  { text: "Notification", icon: <NotificationsNoneOutlinedIcon /> },
  { text: "Setting", icon: <SettingsOutlinedIcon /> },
  { text: "Login as Book Owner", icon: <AccountCircleOutlinedIcon /> },
];

export default function Sidebar1() {
  const theme = useTheme();
  return (
    <Grid container>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            height: "calc(100vh - 32px)",
            boxSizing: "border-box",
            bgcolor: "#171b36",
            color: "white",
            m: 2,
            p: 2,
            borderRadius: 4,
          },
        }}
        variant="permanent"
      >
        <Stack direction={"row"} spacing={2} mb={4}>
          <MenuOutlinedIcon sx={{ color: "white" }} />
          <img src={book3} alt="opened book image" width={25} height={25} />
          <Typography variant="subtitle1" color="#00ABFF">
            Book Rent
          </Typography>
        </Stack>
        <Divider color="#F8F8F8" sx={{ opacity: 0.4 }} />
        <List>
          {list1.map((list) => (
            <ListItem key={list.text} disablePadding>
              <ListItemButton
                sx={{
                  opacity: "75%",
                  fontSize: "14px",
                  fontWeight: 500,
                  lineHeight: "16.94px",
                  ":hover": {
                    bgcolor: "primary.light",
                    opacity: "100%",
                    borderRadius: 1,
                  },
                }}
              >
                <ListItemIcon sx={{ color: "white" }}>{list.icon}</ListItemIcon>
                <ListItemText primary={list.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider color="#F8F8F8" sx={{ opacity: 0.4 }} />
        <List>
          {list2.map((list) => (
            <ListItem key={list.text} disablePadding>
              <ListItemButton
                sx={{
                  opacity: "75%",
                  fontSize: "14px",
                  fontWeight: 500,
                  lineHeight: "16.94px",
                  ":hover": {
                    bgcolor: "primary.light",
                    opacity: "100%",
                    borderRadius: 1,
                  },
                }}
              >
                <ListItemIcon sx={{ color: "white" }}>{list.icon}</ListItemIcon>
                <ListItemText primary={list.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider color="#F8F8F8" sx={{ opacity: 0.4 }} />
        <Stack
          direction="row"
          spacing={2}
          sx={{
            bgcolor: alpha(theme.palette.grey[300], 0.2),
            borderRadius: 1,
            mt: 14,
            py: 1,
            justifyContent: "center",
          }}
        >
          <LogoutOutlinedIcon color="inherit" />
          <Typography variant="subtitle1">Logout</Typography>
        </Stack>
      </Drawer>

      <Grid
        container
        sx={{
          mt: 2,
          ml: `${drawerWidth + 32}px`,
          mr: 2,
          gap: 2,
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            bgcolor: "white",
            pl: 4,
            borderRadius: 4,
            height: "67px",
          }}
        >
          <Typography fontWeight="bold" fontSize="22px" lineHeight={"24px"}>
            Admin
          </Typography>
          <Typography color="gray" fontWeight="light" fontSize="22px" lineHeight={"24px"}>
            /Dashboard
          </Typography>
        </Grid>

        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              height: `calc(100vh - 115px)`,
              boxShadow: "0 8px 24px 0 rgba(69, 69, 80, 0.1)",
            }}
          >
            Today's stats
          </Grid>
          <Grid
            container
            item
            xs={12}
            md={8}
            spacing={2}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Grid
              item
              sx={{
                bgcolor: "white",
                borderRadius: 1,
                height: "346px",
                width: "100%",
                boxShadow: "0 8px 24px 0 rgba(69, 69, 80, 0.1)",
              }}
            >
              Table
            </Grid>
            <Grid
              item
              sx={{
                bgcolor: "white",
                flexGrow: 1,
                borderRadius: 1,
                boxShadow: "0 8px 24px 0 rgba(69, 69, 80, 0.1)",
              }}
            >
              Graph
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
