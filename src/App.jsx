import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Outlet, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Verify from "./Components/Verify";
import ProtectedRoute from "./Components/ProtectedRoute";
import Home from "./Components/Home";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
