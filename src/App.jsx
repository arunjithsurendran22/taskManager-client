import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import UserRegister from "./components/UserRegister";
import UserLogin from "./components/UserLogin";
import Home from "./components/Home";
import RequireAuth from "./Authorization/RequireAuth";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Wrap the Home route with RequireAuth */}
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/" element={<UserLogin />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
