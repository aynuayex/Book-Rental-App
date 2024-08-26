import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import useAuth from "@/hooks/useAuth";

const ThisMonthStatics = () => {
  const {auth} = useAuth();
  const [currentMonthEarnings, setCurrentMonthEarnings] = useState("");
  const [previousMonthEarnings, setPreviousMonthEarnings] = useState("");
  const [percentageChange, setPercentageChange] = useState("");
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getStatics = async () => {
      try {
        const response = await axiosPrivate.get(`${auth.role === "SYSADMIN"?'/earn/month/total':'/earn/month'}`, {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted &&
          setCurrentMonthEarnings(String(response.data.currentMonthEarnings));
        isMounted &&
          setPreviousMonthEarnings(String(response.data.previousMonthEarnings));
        isMounted &&
          setPercentageChange(String(response.data.percentageChange));
      } catch (err) {
        console.error(err);
      }
    };
    getStatics();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  return (
    <Box component={Paper} p={2}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          fontFamily="Inter"
          fontSize={"18px"}
          fontWeight={500}
          lineHeight="24px"
          color="#656575"
        >
          Income
        </Typography>
        <Typography fontFamily="Inter" fontSize={"12px"} color="#656575">
          This Month
        </Typography>
      </Box>
      <Divider />

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          variant="h1"
          component={"header"}
          fontFamily="Inter"
          fontSize={"28px"}
          fontWeight={700}
          lineHeight="40px"
          color="#01150C"
        >
          {`ETB ${currentMonthEarnings}`}
        </Typography>
        <Typography
          fontFamily="Inter"
          fontSize={"16px"}
          fontWeight={500}
          lineHeight="28px"
          letterSpacing="-0.009em"
          color={`${Number(percentageChange) < 0 ?"#FF2727": "#00FF27"}`}
          alignSelf={"end"}
        >
          {Number(percentageChange) < 0 ? (
            <ArrowDownwardIcon sx={{fontSize: "14px"}}  />
          ) : (
            <ArrowUpwardIcon sx={{fontSize: "14px"}}   />
          )}
          {`${Number(percentageChange) < 0? percentageChange.slice(1): percentageChange}%`}
        </Typography>
      </Box>

      <Typography
        variant={"body2"}
        fontFamily="Inter"
        fontSize={"14px"}
        fontWeight={300}
        lineHeight="24px"
        color="#656575"
      >
        {`Compared to ETB ${previousMonthEarnings} last month`}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          fontFamily="Inter"
          fontSize={"14px"}
          fontWeight={300}
          lineHeight="24px"
        >
          Last Month Income
        </Typography>
        <Typography fontFamily="Inter" fontSize={"14px"}>
          {`ETB ${previousMonthEarnings}`}
        </Typography>
      </Box>
    </Box>
  );
};

export default ThisMonthStatics;
