import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeClosed, ArrowLeft } from "lucide-react";
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function ChangePassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const res = await axios.put(
        "http://localhost:5000/api/auth/change-password",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      toast.success("Password Change successful");

      navigate("/product");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Password Change Failed"
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
            to="/product"
          ><ArrowLeft /></Link>
          Change Password
        </h2>

        <input
          type="text"
          name="currentPassword"
          placeholder="Current Password"
          value={formData.currentPassword}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
          required
          autoComplete="off"
        />

        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3">
            {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}

          </button>
        </div>

        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3">
            {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}

          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#FB923C] text-white cursor-pointer text-sm font-semibold rounded hover:bg-[#F97316] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;