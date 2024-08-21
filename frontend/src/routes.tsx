import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import App from "@/App";
import Dashboard from "@/pages/Dashboard";
import Books from "./pages/Books";
import Owners from "./pages/Owners";
import BookUpload from "./pages/BookUpload";
import RootLayout from "./Layouts/RootLayout";
import PersistLogin from "./context/PersistLogin";
import RequireAuth from "./context/RequireAuth";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path="/" element={<Signup />} />
      <Route path="sign-in" element={<Login />} />
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<App />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="books" element={<Books />} />
            <Route path="owners" element={<Owners />} />
            <Route path="book_upload" element={<BookUpload />} />
          </Route>
        </Route>
      </Route>
    </Route>
  )
);

export default router;
