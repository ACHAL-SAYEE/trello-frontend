import React from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const serverUrl = import.meta.env.VITE_server_url;

function Register() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    if (userDetails.password !== userDetails.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const response = await fetch(`${serverUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        toast.success("Registration successful!");
        navigate("/verify", { replace: true });
      } else {
        const data = await response.json();
        toast.error(data.error);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const onChangeUserDetails = async (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };
  return (
    <div className="flex flex-row justify-center items-center">
      <ToastContainer />
      <div className="w-full flex flex-col items-center">
        <h1 className="text-gray-950 font-medium text-4xl">Trello</h1>
        <form className="mt-4 w-[80%]" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            className="border-1 pl-1.5 h-9 border-[#E5E8EC] mb-3 rounded-md w-full"
            value={userDetails.name}
            onChange={onChangeUserDetails}
            required
            name="name"
          />
          <input
            type="text"
            placeholder="Enter your email"
            className="border-1 pl-1.5 h-9 border-[#E5E8EC] mb-3 rounded-md w-full"
            value={userDetails.email}
            onChange={onChangeUserDetails}
            required
            name="email"
          />
          <input
            type="password"
            placeholder="password"
            className="border-1 pl-1.5 h-9 border-[#E5E8EC] mb-3 rounded-md w-full"
            value={userDetails.password}
            onChange={onChangeUserDetails}
            required
            name="password"
          />
          <input
            type="password"
            placeholder="confirm password"
            className="border-1 pl-1.5 h-9 border-[#E5E8EC] mb-3 rounded-md w-full"
            value={userDetails.confirmPassword}
            onChange={onChangeUserDetails}
            required
            name="confirmPassword"
          />
          <button
            type="submit"
            className="bg-[#0052CC] p-1.5 text-white w-full rounded-md hover:bg-red-400 cursor-pointer"
          >
            Sign Up
          </button>
          <p className="mt-2 text-sm">Already User? <Link className="underline text-blue-500" to="/login">Login</Link></p>

        </form>
      </div>
    </div>
  );
}

export default Register;
