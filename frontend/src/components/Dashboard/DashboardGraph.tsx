import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LegendProps,
} from "recharts";

interface CustomizedLegendProps extends LegendProps {
  payload?: any[];
}

const DashboardGraph = () => {
  const [data, setData] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getGraphData = async () => {
      try {
        const response = await axiosPrivate.get("/earn/month/graph", {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setData(response.data.Data);
      } catch (err) {
        console.error(err);
      }
    };
    getGraphData();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const formatNumber = (value: number): string => {
    if (value >= 1000000) {
      // For millions
      return `${(value / 1000000).toFixed(0)}M Birr`;
    } else if (value >= 1000) {
      // For thousands
      return `${(value / 1000).toFixed(0)}k Birr`;
    }
    return `${value} Birr`;
  };

  return (
    <Box sx={{ width: "100%", height:200, textAlign: "center" }}>
          <Typography variant="h4" sx={{
              fontFamily: "Inter",
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "24px",
              color: "#1A1919",
              textAlign: "left", ml: 3 ,mt: 2, mb: -2}} >
            Earning Summary
          </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="20%" stopColor="#006AFF" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#D9D9D9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="#656575"
            strokeOpacity={0.15}
            horizontal={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tickFormatter={formatNumber}
            // label={{ value: '   Your Y-Axis Title', position: 'top', offset: 10, color: "red", margin: {left: 12, right: 12, top:10} }}
          />
          <Tooltip />
          <Legend verticalAlign="top" content={<CustomizedLegend />} />
          <Area
            type="monotone"
            dataKey="currentYear"
            fill="url(#colorUv)"
            stroke="#006AFF"
            strokeOpacity={0.8}
          />
          <Line
            type="monotone"
            dataKey="lastYear"
            stroke="#656575"
            strokeOpacity={0.5}
            strokeDasharray="5 5"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default DashboardGraph;

const CustomizedLegend: React.FC<CustomizedLegendProps> = ({ payload }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        gap: 3,
      }}
    >
      {payload?.map((entry) => (
        <Box
          key={entry.value}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              bgcolor: entry.color,
              borderRadius: "50%",
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Inter",
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "16px",
              color: "#656575",
            }}
          >
            {entry.value === "currentYear"
              ? "Last 6 months"
              : "Same period last year"}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
