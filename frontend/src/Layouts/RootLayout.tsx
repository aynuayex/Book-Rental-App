import { Box, CircularProgress } from "@mui/material";
import { Outlet, useNavigation } from "react-router-dom";

const RootLayout = () => {
  const navigation = useNavigation();

  return (
    <Box
    bgcolor={"#F0F2FF"}
    >
      {navigation.state === "loading" ? (
        <Box sx={{ width: "100vh", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <CircularProgress />
        </Box>
      ) : (
          <Outlet />
      )}
    </Box>
  );
};

export default RootLayout;
