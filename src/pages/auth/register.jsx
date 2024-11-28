import CommonForm from "@/components/common/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
// import {  verifyOTP } from "@/store/auth-slice";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [loading,setLoading] = useState(false)
  const [formData, setFormData] = useState(initialState);
  const [otpModal, setOtpModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const onSubmit = (event) => {
    event.preventDefault();
    registerUser(formData).then((data) => {
      if (data?.success) {
        setOtpModal(true);
        toast({
          title: data?.message,
        });
        // navigate("/auth/login");
      } else {

        toast({
          title: data?.message,
          variant: "destructive",
        });
      }
    });
  };
  const registerUser = async (formData) => {
    setLoading(true)
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      formData
    );
    setLoading(false)
    return response.data;
  };
  const verifyOPTCreateUser = async (otpValue) => {
    verifyOTP({ email: formData?.email, otp: otpValue }).then((data) => {
      if (data?.success) {
        setOtpModal(!otpModal);
        toast({
          title: data?.message,
        });
        navigate("/auth/login");
      } else {
        toast({
          title: data?.message,
          variant: "destructive",
        });
      }
    });
  };
  const verifyOTP = async (formData) => {
    setLoading(true)
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/verifyotp`,
      formData
    );
    setLoading(false)
    return response.data;
  };
  if(loading) return <Skeleton className="fixed inset-0  flex items-center h-[100vh] bg-black  " />
  return (
    <>
   
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create new account
          </h1>
          <p className="mt-2">
            Already have an account
            <Link
              className="font-semibold ml-2 text-primary hover:underline"
              to="/auth/login"
            >
              Login
            </Link>
          </p>
        </div>
        <CommonForm
          formControls={registerFormControls}
          buttonText={"Sign Up"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
        {/* <button
          className="text-gray-500 px-4 py-2 text-lg rounded-md mt-2 absolute top-0 right-0"
          onClick={()=>setOtpModal(!otpModal)}
        >
          X
        </button> */}
      </div>
      <OtpModal
        isOpen={otpModal}
        onClose={() => setOtpModal(false)}
        onSubmit={verifyOPTCreateUser}
      />
    </>
  );
}

export default AuthRegister;

function OtpModal({ isOpen, onClose, onSubmit }) {
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleInputChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus on the next input
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleSubmit = () => {
    const otpValue = otp.join("");
    onSubmit(otpValue);
  };

  return (
    <div
      className={`fixed inset-0  flex items-center h-[100vh] bg-[rgb(23,45,24,0.5)] justify-center ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white p-8 rounded-md shadow-md relative">
        <button
          className="text-gray-500 px-4 py-2 text-lg rounded-md mt-2 absolute top-0 right-0"
          onClick={onClose}
        >
          X
        </button>
        <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>

        <div className="flex">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength="1"
              className="w-12 h-12 border border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          ))}
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
          onClick={handleSubmit}
        >
          Verify
        </button>
      </div>
    </div>
  );
}
