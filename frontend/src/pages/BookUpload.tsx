import { DRAWER_WIDTH } from "@/constants/DrawerConstansts";
import { HEADING_HEIGHT } from "@/constants/headingConstants";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import smile from "@/assets/smile.png";

const initialFormData = {
  book: "",
  author: "",
  category: "",
  quantity: "",
  price: "",
};

const BookUpload = () => {
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [message, setMessage] = useState("");
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [formData, setFormdata] = useState(initialFormData);
  const axiosPrivate = useAxiosPrivate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormdata((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleClose = (e?: React.SyntheticEvent | Event, reason?: string) => { 
    console.log(e);
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await axiosPrivate.post("/books/upload", {
        ...formData,
      });
      if (response.status === 201) {
        setOpenSuccessDialog(true);
      }
      console.log(response);
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 409) {
        setOpenSnackBar(true);
        setMessage(
          "The book already exists, please edit on the dashboard or create a new one!"
        );
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        width: `calc(100vw - ${DRAWER_WIDTH + 48}px)`,
        height: `calc(100vh - ${HEADING_HEIGHT + 48}px)`,
        borderRadius: 1,
        bgcolor: "white",
        boxShadow: "0 8px 24px 0 rgba(69, 69, 80, 0.1)",
      }}
    >
      <Snackbar
        autoHideDuration={8000}
        open={openSnackBar}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert severity="error" variant="filled" onClose={handleClose}>
          {message}
        </Alert>
      </Snackbar>
      <Dialog PaperProps={{
          sx: {
            borderRadius: 6,
          },
        }}
        open={openSuccessDialog}
        onClose={() => setOpenSuccessDialog(false)}
      >
        <DialogContent>
            <Box sx={{
                  fontsize: "30px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
            <img src={smile} alt="success smile image" width={50} height={50} />
              </Box>
              <Typography
                gutterBottom
                sx={{
                  color: "black",
                  fontSize: "18px",
                  fontWeight: 600,
                  lineHeight: "21.78px",
                }}
              >
                Congrats!
              </Typography>
              <Typography
                sx={{
                  color: "black",
                  opacity: 0.5,
                  fontSize: "12px",
                  fontWeight: 400,
                  lineHeight: "14.52px",
                }}
              >
                You have uploaded the book successfully.Wait until we approve
                it.
              </Typography>
            </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button sx={{width: "100px", bgcolor: "primary.light", mb: 2}}
            autoFocus
            onClick={() => setOpenSuccessDialog(false)}
            variant="contained"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Typography mt={4} gutterBottom>
        Upload New Book
      </Typography>
      <Button variant="contained" onClick={() => setOpenFormDialog(true)}>
        Add Book Description
      </Button>
      <Dialog
        open={openFormDialog}
        onClose={() => setOpenFormDialog(false)}
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title" textAlign={"center"}>
          Add Book
        </DialogTitle>
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
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            fullWidth
            autoFocus
            sx={{ textTransform: "none", m: 2, bgcolor: "primary.light" }}
            onClick={() => setOpenFormDialog(false)}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <TextField
          required
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          label="Book Quantity"
          size="small"
        />
        <TextField
          required
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          label="Book Price for 2 weeks"
          size="small"
        />
      </Box>
      <Button
        startIcon={<FileUploadOutlinedIcon />}
        sx={{ textTransform: "none", color: "primary.light" }}
      >
        Upload Book Cover
      </Button>
      <Button
        variant="contained"
        type="submit"
        sx={{
          width: "300px",
          height: "60px",
          borderRadius: 6,
          textTransform: "none",
          bgcolor: "primary.light",
        }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default BookUpload;
