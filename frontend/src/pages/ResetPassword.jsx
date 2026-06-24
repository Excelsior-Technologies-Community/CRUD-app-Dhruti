import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, Eye, EyeClosed } from "lucide-react";

function ResetPassword() {
    const [password, setPassword] =
        useState("");

    const [confirmPassword,
        setConfirmPassword] =
        useState("");

    const navigate =
        useNavigate();

    const email =
        localStorage.getItem(
            "resetEmail"
        );

    const otp =
        localStorage.getItem(
            "verifiedOtp"
        );

    const [showPassword, setShowPassword] = useState(false);

    const notifySuccess = (message) => toast.success(message);


    const handleResetPassword =
        async (e) => {
            e.preventDefault();

            try {
                const response =
                    await axios.post(
                        "http://localhost:5000/api/auth/reset-password",
                        {
                            email,
                            otp,
                            newPassword:
                                password,
                        }
                    );

                toast.success(
                    response.data.message
                );

                localStorage.removeItem(
                    "resetEmail"
                );

                localStorage.removeItem(
                    "verifiedOtp"
                );

                navigate("/login");

            } catch (error) {
                toast.error(
                    error.response.data.message
                );
            }
        };

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#18181B]">
            <form
                onSubmit={handleResetPassword}
                className="bg-[#27272A] border border-[#3F3F46] p-8 rounded-lg shadow-md w-96"
            >
                <h2 className="text-2xl font-bold text-center pb-3">
                    Reset Password
                </h2>

                <div className="relative flex items-center">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
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
                        name="password"
                        placeholder="Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(
                                e.target.value
                            )
                        }
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
                    Reset Password
                </button>
            </form>
        </div>
    );
}

export default ResetPassword
