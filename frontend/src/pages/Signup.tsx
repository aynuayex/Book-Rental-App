import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Divider from "@mui/material/Divider";
import { useState } from "react";

import book1 from "../assets/book1.png";
import book2 from "../assets/book2.png";
import axios from "@/api/axios";
import { Link as RouterLink } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import smile from "@/assets/smile.png";
import { LoadingButton } from "@mui/lab";

const initialFormData = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  location: "",
  phoneNumber: "",
};

function Signup() {
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [persist, setPersist] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormdata] = useState(initialFormData);
  const { setAuth } = useAuth();

  const handleClose = (e?: React.SyntheticEvent | Event, reason?: string) => {
    console.log(e);
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormdata((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrMsg("password and confirm password must match");
      setOpen(true);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("/register", {
        ...formData,
        role: "OWNER",
      });
      if (response.status === 201) {
        const { id, email, fullName, role, accessToken } = response.data;
        setAuth({ id, email, fullName, role, accessToken });
        setOpenDialog(true);
      }
      console.log(response);
    } catch (err: any) {
      console.error(err);
      if (!err?.response) {
        setErrMsg("Server can not be reached, Please Try again later!");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing One of the Fields, Please fill All!");
      } else if (err.response?.status === 409) {
        setErrMsg(err.response?.data.message);
      } else {
        setErrMsg("Registration Failed, Please Try again later!");
      }
      setOpen(true);
    } finally {
      setLoading(false);
    }
    console.log(formData);
  };

  return (
    <Box>
      <Stack
        direction="row"
        sx={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <Snackbar
          autoHideDuration={8000}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Alert severity="error" variant="filled" onClose={handleClose}>
            {errMsg}
          </Alert>
        </Snackbar>

        <Dialog
          PaperProps={{
            sx: {
              borderRadius: 6,
            },
          }}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        >
          <DialogContent>
            <Box
              sx={{
                fontsize: "30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={smile}
                  alt="success smile image"
                  width={50}
                  height={50}
                />
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
                You are registered successfully!Wait until we approve your
                account.
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
            <Button
              sx={{ width: "100px", bgcolor: "primary.light", mb: 2 }}
              autoFocus
              onClick={() => setOpenDialog(false)}
              variant="contained"
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>

        <Box
          sx={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "#171B36",
          }}
        >
          <img src={book1} alt="opened book image" width={150} height={150} />
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
            bgcolor: "white",
            p: 8,
          }}
        >
          <Stack direction={"row"} spacing={2}>
            <img src={book2} alt="opened book image" width={50} height={50} />
            <Typography variant="h4">Book Rent</Typography>
          </Stack>
          <Typography variant="h5" sx={{ mb: -1, cursor: "default" }}>
            Signup as Owner
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <TextField
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <MailOutlineIcon />
                <span style={{ marginLeft: 8 }}>Full Name</span>
              </div>
            }
            size="small"
          />
          <TextField
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <MailOutlineIcon />
                <span style={{ marginLeft: 8 }}>Email address</span>
              </div>
            }
            size="small"
          />
          <TextField
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <LockOutlinedIcon />
                <span style={{ marginLeft: 8 }}>Password</span>
              </div>
            }
            size="small"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <LockOutlinedIcon />
                <span style={{ marginLeft: 8 }}>Confirm Password</span>
              </div>
            }
            size="small"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <LocationOnIcon />
                <span style={{ marginLeft: 8 }}>Location</span>
              </div>
            }
            size="small"
          />
          <TextField
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <PhoneIcon />
                <span style={{ marginLeft: 8 }}>Phone Number</span>
              </div>
            }
            size="small"
          />
          <Box>
            <FormControlLabel
              label="I accept the Terms and Conditions"
              control={
                <Checkbox
                  checked={persist}
                  onChange={(e) => setPersist(e.target.checked)}
                />
              }
            />
          </Box>

          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            loading={loading}
          >
            Sign up
          </LoadingButton>
          <Typography variant="subtitle2" textAlign={"center"}>
            Already have an account?
            <Link component={RouterLink} to="/sign-in" replace={true}>
              Login
            </Link>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default Signup;
