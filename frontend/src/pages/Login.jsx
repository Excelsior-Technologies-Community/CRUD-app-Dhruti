import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, Eye, EyeClosed } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const notifySuccess = (message) => toast.success(message);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      // alert("Login Successful");
      notifySuccess("Login successfull");

      navigate("/product");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#18181B]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#27272A] border border-[#3F3F46] p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold text-center pb-3">
          <Link
            to="/"
          ><ArrowLeft /></Link>
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
          required
        />

        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3">
            {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <Link
        to="/forgot-password">
        <div className="">
          <p className="pb-3 text-left text-[15px] cursor-pointer hover:underline">forgot password ??</p>
        </div>
        </Link>

        <button
          type="submit"
          className="w-full py-3 bg-[#FB923C] text-white cursor-pointer text-sm font-semibold rounded hover:bg-[#F97316] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          Login
        </button>

        <p className="text-center mt-4 pt-2">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;