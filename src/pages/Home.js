import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './styles.css';


const Home = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate(); // For navigation

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost/get_events.php");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Clear any stored user session data (e.g., token)
    localStorage.removeItem("authToken"); // Example if using localStorage
    sessionStorage.removeItem("authToken"); // Example if using sessionStorage
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Upcoming Events</h1>
        <button onClick={handleLogout} style={{ padding: "10px", cursor: "pointer" }}>
          Logout
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
                width: "300px",
              }}
            >
              <h3>
                <Link to={`/event/${event.id}`}>{event.title}</Link>
              </h3>
              <p>{event.description}</p>
              <p>
                <strong>Date:</strong> {new Date(event.date).toLocaleString()}
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
            </div>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
