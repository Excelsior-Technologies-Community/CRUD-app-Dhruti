import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function VerifyOtp() {
    const [otp, setOtp] = useState("");

    const email =
        localStorage.getItem(
            "resetEmail"
        );

    const navigate = useNavigate();
    const notifySuccess = (message) => toast.success(message);


    const handleVerifyOtp = async (
        e
    ) => {
        e.preventDefault();

        try {
            const response =
                await axios.post(
                    "http://localhost:5000/api/auth/verify-otp",
                    {
                        email,
                        otp,
                    }
                );

            toast.success(
                response.data.message
            );

            localStorage.setItem(
                "verifiedOtp",
                otp
            );

            navigate("/reset-password");

        } catch (error) {
            toast.error(
                error.response.data.message
            );
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#18181B]">
            <form
                onSubmit={handleVerifyOtp}
                className="bg-[#27272A] border border-[#3F3F46] p-8 rounded-lg shadow-md w-96"
            >
                <h2 className="text-2xl font-bold text-center pb-3">
                    Verify OTP
                </h2>

                <input
                    type="text"
                    name="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) =>
                        setOtp(e.target.value)
                    }
                    className="w-full p-3 border rounded mb-4"
                    required
                />

                <button
                    type="submit"
                    className="w-full py-3 bg-[#FB923C] text-white cursor-pointer text-sm font-semibold rounded hover:bg-[#F97316] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                    Verify Otp
                </button>
            </form>
        </div>
    );
}

export default VerifyOtp
