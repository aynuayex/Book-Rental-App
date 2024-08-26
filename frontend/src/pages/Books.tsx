import { DRAWER_WIDTH } from "@/constants/DrawerConstansts";
import { HEADING_HEIGHT } from "@/constants/headingConstants";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Box, Button, FormControlLabel, Switch } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useState, useEffect, useMemo } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { Book } from "../components/Dashboard/DashboardTable";

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>(
    {}
  );

  const axiosPrivate = useAxiosPrivate();

  const handleChange = async (id: string, checked: boolean) => {
    try {
      const rented = books.filter((book) => book.id === id)[0]?.rented;
      console.log({rented,id})
      const response = await axiosPrivate.post(`/books/${id}`, {
        rented,
        approved: checked,
      });
      console.log(response);

      // Update the specific row's checked state
      setCheckedState((prev) => ({
        ...prev,
        [id]: checked,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const columns = useMemo<GridColDef<(typeof books)[number]>[]>(
    () => [
      { field: "id", headerName: "ID" },
      {
        field: "author",
        headerName: "Author",
        valueFormatter: (value?: string) => {
          if (value == null) {
            return "";
          }
          return value
            .split(" ")
            .map((word) => {
              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(" ");
        },
        width: 200,
      },
      {
        field: "uploadedBy",
        headerName: "Owner",
        valueFormatter: (value?: string) => {
          if (value == null) {
            return "";
          }
          return value
            .split(" ")
            .map((word) => {
              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(" ");
        },
        width: 200,
      },
      {
        field: "category",
        headerName: "Category",
        valueFormatter: (value?: string) => {
          if (value == null) {
            return "";
          }
          return value
            .split(" ")
            .map((word) => {
              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(" ");
        },
      },
      {
        field: "book",
        headerName: "Book Name",
        valueFormatter: (value?: string) => {
          if (value == null) {
            return "";
          }
          return value
            .split(" ")
            .map((word) => {
              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(" ");
        },
        width: 150,
      },
      {
        field: "approved",
        headerName: "Status",
        headerAlign: "center",
        width: 200,
        editable: true,
        renderCell: (params: any) => {
          const isApproved = params.row?.approved as boolean;
          const id = params.row?.id as string;
          const checked =
            checkedState[id] !== undefined ? checkedState[id] : isApproved;

          return (
            <Button
              fullWidth
              startIcon={checked ? <CheckIcon /> : <ClearIcon />}
              color={checked ? "success" : "error"}
              sx={{
                textTransform: "none",
                borderRadius: 6,
                p: 0,
                bgcolor: "#F0F2FF",
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={checked}
                    onChange={(event) => handleChange(id, event.target.checked)}
                    color={checked ? "success" : "error"}
                  />
                }
                label={checked ? "Active" : "InActive"}
                labelPlacement="start"
              />
            </Button>
          );
        },
      },
    ],
    [handleChange]
  );

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getBooks = async () => {
      try {
        const response = await axiosPrivate.get("/books", {
          signal: controller.signal,
        });
        console.log(response.data);
        if (isMounted) {
          setBooks(response.data.allBooks);
          // Initialize the checked state for each book
          const initialCheckedState: { [key: string]: boolean } = {};
          response.data.allBooks.forEach((book: Book) => {
            initialCheckedState[book.id] = book.approved;
          });
          setCheckedState(initialCheckedState);
        }
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        width: `calc(100vw - ${DRAWER_WIDTH + 48}px)`,
        height: `calc(100vh - ${HEADING_HEIGHT + 48}px)`,
        bgcolor: "white",
        borderRadius: 1,
        boxShadow: "0 8px 24px 0 rgba(69, 69, 80, 0.1)",
      }}
    >
      <Box sx={{ width: "95%", height: "100%" }}>
        <DataGrid
          rows={books}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              csvOptions: { disableToolbarButton: true },
              printOptions: { disableToolbarButton: true },
              showQuickFilter: true,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Books;
