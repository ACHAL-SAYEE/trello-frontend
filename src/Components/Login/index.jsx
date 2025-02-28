import React from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
const serverUrl = import.meta.env.VITE_server_url;

function Login() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    try {
      const response = await fetch(`${serverUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        toast.success("Login successful!");

        Cookies.set("trelloToken", data.token, {
          expires: 30,
        });
        navigate("/");
        navigate("/", { replace: true });
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

          <button
            type="submit"
            className="bg-[#0052CC] p-1.5 text-white w-full rounded-md hover:bg-red-400 cursor-pointer"
          >
            Login
          </button>
          <p className="mt-2 text-sm">
            Not User?{" "}
            <Link className="underline text-blue-500" to="/register">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
