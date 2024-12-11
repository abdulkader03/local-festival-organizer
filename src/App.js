import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={< Login/>} />
        <Route path="/login" element={< Login/>} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
