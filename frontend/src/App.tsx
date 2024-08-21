import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
// import './App.css'
import {
  ADMIN_SIDE_BAR_LIST_ONE,
  ADMIN_SIDE_BAR_LIST_TWO,
  DRAWER_WIDTH,
  OWNER_SIDE_BAR_LIST_ONE,
  OWNER_SIDE_BAR_LIST_TWO,
} from "@/constants/DrawerConstansts";
import Heading from "@/components/Heading";
import Sidebar from "@/components/Sidebar";
import useAuth from "./hooks/useAuth";

function App() {
  const { auth } = useAuth();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        ml: `${DRAWER_WIDTH + 32}px`,
        mr: 2,
        gap: 2,
      }}
    >
      {auth?.role === "SYSADMIN" ? (
        <>
          <Sidebar
            list1={ADMIN_SIDE_BAR_LIST_ONE}
            list2={ADMIN_SIDE_BAR_LIST_TWO}
          />
          <Heading
            role="Admin"
            lists={[...ADMIN_SIDE_BAR_LIST_ONE, ...ADMIN_SIDE_BAR_LIST_TWO]}
          />
        </>
      ) : (
        <>
          <Sidebar
            list1={OWNER_SIDE_BAR_LIST_ONE}
            list2={OWNER_SIDE_BAR_LIST_TWO}
          />
          <Heading
            role="Owner"
            lists={[...OWNER_SIDE_BAR_LIST_ONE, ...OWNER_SIDE_BAR_LIST_TWO]}
          />
        </>
      )}
      <Box >
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;
