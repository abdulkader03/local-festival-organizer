import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios";
import './styles.css';


const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });
  const [editEvent, setEditEvent] = useState(null); // Holds the event being edited
  const organizerId = localStorage.getItem("user_id"); // Assuming organizer ID is stored after login
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.post("http://localhost/get_organizer_events.php", {
          organizer_id: organizerId,
        });
        if (response.data.success) {
          setEvents(response.data.events);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [organizerId]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost/create_event.php", {
        ...newEvent,
        organizer_id: organizerId,
      });
      if (response.data.success) {
        setEvents([...events, { ...newEvent, id: response.data.id }]);
        setNewEvent({ title: "", description: "", date: "", location: "" });
        setMessage("Event created successfully!");
      } else {
        setMessage("Error creating event: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setMessage("An error occurred while creating the event.");
    }
  };

  const handleEditEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost/edit_event.php", editEvent);
      if (response.data.success) {
        setEvents(
          events.map((event) =>
            event.id === editEvent.id ? { ...editEvent } : event
          )
        );
        setEditEvent(null);
        setMessage("Event updated successfully!");
      } else {
        setMessage("Error updating event: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      setMessage("An error occurred while updating the event.");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await axios.post("http://localhost/delete_event.php", { event_id: eventId });
      if (response.data.success) {
        setEvents(events.filter((event) => event.id !== eventId));
        setMessage("Event deleted successfully!");
      } else {
        setMessage("Error deleting event: " + response.data.message);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setMessage("An error occurred while deleting the event.");
    }
  };

  const handleLogout = () => {
    // Clear session storage or localStorage
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    // Redirect to the login page
    navigate("/login");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Organizer Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: "10px", cursor: "pointer" }}>
          Logout
        </button>
      </div>
      <h2>Your Events</h2>
      {message && <p>{message}</p>}
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.title} - {new Date(event.date).toLocaleString()}
            <button onClick={() => setEditEvent(event)}>Edit</button>
            <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>{editEvent ? "Edit Event" : "Create Event"}</h2>
      <form onSubmit={editEvent ? handleEditEvent : handleCreateEvent}>
        <input
          type="text"
          placeholder="Title"
          value={editEvent ? editEvent.title : newEvent.title}
          onChange={(e) =>
            editEvent
              ? setEditEvent({ ...editEvent, title: e.target.value })
              : setNewEvent({ ...newEvent, title: e.target.value })
          }
          required
        />
        <textarea
          placeholder="Description"
          value={editEvent ? editEvent.description : newEvent.description}
          onChange={(e) =>
            editEvent
              ? setEditEvent({ ...editEvent, description: e.target.value })
              : setNewEvent({ ...newEvent, description: e.target.value })
          }
          required
        />
        <input
          type="datetime-local"
          value={editEvent ? editEvent.date : newEvent.date}
          onChange={(e) =>
            editEvent
              ? setEditEvent({ ...editEvent, date: e.target.value })
              : setNewEvent({ ...newEvent, date: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={editEvent ? editEvent.location : newEvent.location}
          onChange={(e) =>
            editEvent
              ? setEditEvent({ ...editEvent, location: e.target.value })
              : setNewEvent({ ...newEvent, location: e.target.value })
          }
          required
        />
        <button type="submit">{editEvent ? "Update Event" : "Create Event"}</button>
        {editEvent && (
          <button type="button" onClick={() => setEditEvent(null)}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default OrganizerDashboard;
