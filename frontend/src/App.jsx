import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Product from "./components/Product";
import Register from './pages/Register';
import Login from "./pages/Login";
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";

function Home() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold">Product Management Dashboard</h1>
      <Link to="/login" className="text-blue-500 underline">Login</Link>
    </div>
  );
}

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product" element={<Product />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

        </Routes>
      </Router>
      <ToastContainer position="top-center" autoClose={1500} theme="dark" draggable={true} transition={Slide} />

    </>
  )
}

export default App
