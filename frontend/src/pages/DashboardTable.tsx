import { DRAWER_WIDTH } from "@/constants/DrawerConstansts";
import { HEADING_HEIGHT } from "@/constants/headingConstants";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  Dialog,
  DialogContent,
  TextField,
  MenuItem,
  DialogActions,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridToolbar,
  GridRowId,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import { useState, useEffect, useCallback, useMemo } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import useAuth from "@/hooks/useAuth";
import EditIcon from '@mui/icons-material/Edit';

export interface Book {
  id: string;
  book: string;
  author: string;
  category: string;
  quantity: string;
  price: string;
  approved: boolean;
  rented: boolean;
  uploadedById: string;
  uploadedBy?: string;
}

const initialFormData = {
    id: "",
  book: "",
  author: "",
  category: "",
  quantity: "",
  price: "",
};

const DashboardTable = () => {
  const { auth, setAuth } = useAuth();
  const [open, setOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [formData, setFormData] = useState(initialFormData);
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>(
    {}
  );

  const axiosPrivate = useAxiosPrivate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleChange = async (id: string, checked: boolean) => {
    try {
      const approved = books.filter((book) => book.id === id)[0].approved;
      // if hacked with javascript
      const response =
        auth &&
        "role" in auth &&
        auth?.role === "OWNER" &&
        (await axiosPrivate.post(`/books/${id}`, {
          approved,
          rented: checked,
        }));
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

  const deleteBook = useCallback(
    (id: GridRowId) => async () => {
      try {
        const response = await axiosPrivate.delete(`/books/${id}`);
        console.log(response.data);
        setBooks(response.data.allBooks);
      } catch (err) {
        console.error(err);
      }
    },
    [books]
  );

  const updateBookDetail = useCallback(
    (id: GridRowId) => () => {
      const filterBook = books.find((book) => book.id === id);
      filterBook &&
        setFormData({
            id: filterBook.id,
          book: filterBook.book,
          author: filterBook.author,
          category: filterBook.category,
          quantity: filterBook.quantity,
          price: filterBook.price,
        });
      setOpen(true);
    },
    [books]
  );

  const columns = useMemo<GridColDef[]>(() => {
    const baseColumns: GridColDef[] = [
      {
        field: "id",
        headerName: "ID",
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
        field: "rented",
        headerName: "Status",
        headerAlign: "center",
        width: 200,
        editable: true,
        renderCell: (params: GridRenderCellParams<Book>) => {
          const isRented = params.row.rented as boolean;
          const id = params.row.id as string;
          const checked =
            checkedState[id] !== undefined ? checkedState[id] : isRented;

          return (
            <Button
              fullWidth
              // add circle here
              //   startIcon={checked ? <CheckIcon /> : <ClearIcon />}
              color={checked ? "error" : "info"}
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
                    disabled={
                      auth && "role" in auth && auth?.role === "SYSADMIN"
                        ? true
                        : false
                    }
                    checked={checked}
                    onChange={(event) => handleChange(id, event.target.checked)}
                    color={checked ? "error" : "info"}
                  />
                }
                label={checked ? "Rented" : "Free"}
                labelPlacement="start"
              />
            </Button>
          );
        },
      },
      {
        field: "price",
        headerName: "Price",
        valueFormatter: (value) => {
          if (value == null) {
            return "";
          }
          return `${value} Birr`;
        },
      },
    ];
    if (auth && "role" in auth && auth.role === "SYSADMIN") {
        const ownerColumn: GridColDef = {
          field: "uploadedBy",
          headerName: "Owner",
          valueFormatter: (value?: string) => {
            if (value == null) {
              return '';
            }
            return value.split(' ').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ');
          },
          width: 200,
        };
    
        // Insert the owner column at the second index (index 1)
        baseColumns.splice(1, 0, ownerColumn);
      }

    if (auth && "role" in auth && auth?.role === "OWNER") {
      baseColumns.push({
        field: "actions",
        headerName: "Actions",
        type: "actions",
        width: 150,
        getActions: (params: GridRowParams<Book>) => [
          <GridActionsCellItem
            icon={<EditIcon sx={{ color: "black" }} />}
            label="Update Book"
            onClick={updateBookDetail(params.id)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon sx={{ color: "red" }} />}
            label="Delete Book"
            onClick={deleteBook(params.id)}
          />,
        ],
      });
    }

    return baseColumns;
  }, [auth, checkedState, handleChange, updateBookDetail, deleteBook]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getBooks = async () => {
      try {
        // console.log(auth && "id" in auth && auth?.id);
        const response = await axiosPrivate.get(
          `${
            auth && "role" in auth && auth?.role === "SYSADMIN"
              ? "/books"
              : `/books/${auth && "id" in auth && auth?.id}`
          }`,
          {
            signal: controller.signal,
          }
        );
        console.log(response.data);
        if (isMounted) {
          setBooks(response.data.allBooks);
          // Initialize the checked state for each book
          const initialCheckedState: { [key: string]: boolean } = {};
          response.data.allBooks.forEach((book: Book) => {
            initialCheckedState[book.id] = book.rented;
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
        // width: `calc(100vw - ${DRAWER_WIDTH + 48}px)`,
        // height: `calc(100vh - ${HEADING_HEIGHT + 48}px)`,
        height: `346px`,
        borderRadius: 1,
        bgcolor: "white",
      }}
    >
      <Box sx={{ width: "90%", height: "100%" }}>
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
      <Dialog
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            try {
                event.preventDefault();
                console.log(formData);
                const response = await axiosPrivate.post(`/books/detail/${formData.id}`, {...formData});
                console.log(response);
          
                setBooks(response.data.allBooks)
                setOpen(false);
              } catch (err) {
                console.error(err);
              }
          },
        }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            name="book"
            value={formData.book}
            onChange={handleInputChange}
            label="Book Name"
            fullWidth
            variant="filled"
          />
          <TextField
            required
            margin="dense"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            label="Author Name"
            fullWidth
            variant="filled"
          />
          <TextField
            select
            required
            margin="dense"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            label="Category"
            fullWidth
            variant="filled"
          >
            <MenuItem value="FICTION">Fiction</MenuItem>
            <MenuItem value="SELF_HELP">Self Help</MenuItem>
            <MenuItem value="BUSINESS">Business</MenuItem>
          </TextField>
          <TextField
            required
            margin="dense"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            label="Book Quantity"
            fullWidth
            variant="filled"
          />
          <TextField
            required
            margin="dense"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            label="Book Price for 2 weeks"
            fullWidth
            variant="filled"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            type="submit"
            autoFocus
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardTable;
