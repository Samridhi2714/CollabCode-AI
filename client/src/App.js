import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";           
import Room from "./pages/Room";          
import PrivateRoute from "./utils/PrivateRoute";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />   
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Room Route (Protected) */}
        <Route
          path="/room/:roomId"
          element={
            <PrivateRoute>
              <Room />
            </PrivateRoute>
          }
        />
      </Routes>
       <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;