import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
        "http://localhost:5000/api/auth/register",
        formData
      );

      toast.success("Register successful");

      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Registration Failed"
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
          Register
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
          required
          autoComplete="off"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
          required
        />

        {/* <div className="relative flex items-center">
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
        </div> */}

        <button
          type="submit"
          className="w-full py-3 bg-[#FB923C] text-white cursor-pointer text-sm font-semibold rounded hover:bg-[#F97316] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          Register
        </button>

        <p className="text-center mt-4 pt-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;