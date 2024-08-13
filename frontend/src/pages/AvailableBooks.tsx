import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, Tooltip, LegendProps } from "recharts";

interface CustomizedLegendProps extends LegendProps {
    payload?: any[]; 
  }
  
const COLORS = ["#006AFF", "#52C93F", "#FF2727"];

const AvailableBooks = () => {
  const [availableBooks, setAvailableBooks] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getBooks = async () => {
      try {
        const response = await axiosPrivate.get("/books/available", {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setAvailableBooks(response.data.bookCategoryArray);
      } catch (err) {
        console.error(err);
      }
    };
    getBooks();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <Box component={Paper}>
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
        <Typography
          component={"header"}
          fontSize={"18px"}
          fontWeight={500}
          lineHeight="24px"
          color="#656575"
        >
          Available Books
        </Typography>
        <Typography component={"header"} fontSize={"12px"} color="#656575">
          Today
        </Typography>
      </Box>
      <PieChart width={288} height={360}>
        {/* <PieChart width={318} height={400}> */}
        <Pie
          data={availableBooks}
          //   cx={120}
          //   cy={200}
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
        >
          {availableBooks?.map((entry, index) => (
            <>
            {console.log(entry)}
            <Cell key={`cell-${index}`} fill={COLORS[index]} /></>
          ))}
        </Pie>

        <Tooltip />
        <Legend
        width={200}
          iconType="circle"
          layout="vertical"
          content={<CustomizedLegend />}
        />
      </PieChart>
    </Box>
  );
};

const CustomizedLegend: React.FC<CustomizedLegendProps> = ({ payload }) => {
  return (
    <Box>
      {payload?.map((entry) => (
        <Box
          key={entry.value}
          sx={{
            mb: 1, 
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: entry.color,
                borderRadius: "50%",
                mr: 1, 
              }}
            />
            <Typography variant="body2">
              {entry.value
                ?.split("_")
                .map(
                  (word: string) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")}
            </Typography>
          </Box>
          <Typography variant="body2">{entry.payload.value}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default AvailableBooks;


