import { Alert, Box, Snackbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { HEADING_HEIGHT } from "@/constants/headingConstants";
import DashboardTable from "../components/Dashboard/DashboardTable";
import AvailableBooks from "../components/Dashboard/AvailableBooks";
import ThisMonthStatics from "@/components/Dashboard/ThisMonthStatics";
import { format } from "date-fns";
import DashboardGraph from "@/components/Dashboard/DashboardGraph";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { auth } = useAuth();
  const message = location?.state?.message;
  console.log(auth);

  useEffect(() => {
    message && setOpen(true);
  }, [message]);

  const handleClose = (e?: React.SyntheticEvent | Event, reason?: string) => {
    console.log(e);
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Box>
      <Snackbar
        autoHideDuration={8000}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert severity="success" variant="filled" onClose={handleClose}>
          {message}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          height: `calc(100vh - ${HEADING_HEIGHT + 48}px)`,
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            bgcolor: "white",
            borderRadius: 3,
            width: "318px",
            boxShadow: "0 8px 24px 0 rgba(69, 69, 80, 0.1)",
          }}
        >
          <Box>
            <Typography
              variant={"h2"}
              fontFamily="Inter"
              fontWeight={"500"}
              fontSize={"20px"}
              lineHeight={"30px"}
              color="#525256"
            >
              This Month Statics
            </Typography>
            <Typography
              variant={"body2"}
              fontFamily="Inter"
              color={"#A3A3A3"}
              lineHeight={"18px"}
            >
              {format(new Date(), "EEE, dd MMM, yyyy, hh.mm a")}
            </Typography>
          </Box>
          <ThisMonthStatics />
          <AvailableBooks />
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}
        >
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              height: "346px",
              boxShadow: "0 8px 24px 0 rgba(69, 69, 80, 0.1)",
            }}
          >
            <DashboardTable />
          </Box>
          <Box
            // component={Paper}
            sx={{
              bgcolor: "white",
              flexGrow: 1,
              borderRadius: 1,
              boxShadow: "0 8px 24px 0 rgba(69, 69, 80, 0.1)",
            }}
          >
            <DashboardGraph />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
