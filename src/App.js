import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import OrganizerDashboard from "./pages/OrganizerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={< Login/>} />
        <Route path="/login" element={< Login/>} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<Home />} />
        <Route path="/dashboard" element={<OrganizerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
