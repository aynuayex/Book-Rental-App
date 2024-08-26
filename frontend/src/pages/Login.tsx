import {
  Alert,
  Box,
  Checkbox,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Divider from "@mui/material/Divider";
import { useEffect, useState } from "react";

import book1 from "../assets/book1.png";
import book2 from "../assets/book2.png";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import axios from "@/api/axios";
import useAuth from "@/hooks/useAuth";
import { LoadingButton } from "@mui/lab";

const initialFormData = {
  email: "",
  password: "",
};

function Login() {
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormdata] = useState(initialFormData);
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth, persist, setPersist } = useAuth();

  const role = location?.state?.role;
  const message = location?.state?.message;

  useEffect(() => {
    message && setOpen(true);
  },[message]);

  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormdata((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleClose = (e?: React.SyntheticEvent | Event, reason?: string) => {
    console.log(e);
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log(formData, role);
      const response = await axios.post("/login", {
        ...formData,
        role: role || "OWNER",
      });
      if (response.status === 200) {
        const { id, email, fullName, success, role, accessToken } =
          response.data;
        setAuth({ id, email, fullName, role, accessToken });
        navigate("/dashboard", { state: { message: success }, replace: true });
      }
      console.log(response);
    } catch (err: any) {
      console.error(err);
      if (!err?.response) {
        setErrMsg("Server can not be reached, Please Try again later!");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Email or Password!");
      } else if (err.response?.status === 401) {
        setErrMsg(
          "Unauthorized, Your Email and/or Password is not correct!"
        );
      } else if (err.response?.status === 403) {
        setErrMsg(
          "Forbidden,Your account is not approved by Admin!"
        );
      } else {
        setErrMsg("Login Failed, Please Try again later!");
      }
      setOpen(true);
    } finally {
      setLoading(false);
    }
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
          <Alert severity={errMsg? "error":"info"} variant="filled" onClose={handleClose}>
            {errMsg? errMsg: message}
          </Alert>
        </Snackbar>
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
            Login/{role === "SYSADMIN"?"Admin":"Owner"}
          </Typography>
          <Divider sx={{ mb: 3 }} />
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
          <Box>
            <FormControlLabel
              label="Remember me"
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
            Login
          </LoadingButton>
          <Typography variant="subtitle2" textAlign={"center"}>
            Have not an account?
            <Link component={RouterLink} to="/">
              Signup
            </Link>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default Login;
