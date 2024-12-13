import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });
  const [visualFile, setVisualFile] = useState(null); // For visual uploads
  const [editEvent, setEditEvent] = useState(null); // Holds the event being edited
  const [selectedEventAttendees, setSelectedEventAttendees] = useState([]); // Stores attendees
  const [attendeeModalOpen, setAttendeeModalOpen] = useState(false); // Modal state
  const organizerId = localStorage.getItem("user_id"); // Assuming organizer ID is stored after login
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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
        const eventId = response.data.id;

        // Upload visual if provided
        if (visualFile) {
          const formData = new FormData();
          formData.append("visual", visualFile);
          formData.append("event_id", eventId);

          await axios.post("http://localhost/upload_visual.php", formData);
        }

        setEvents([...events, { ...newEvent, id: eventId }]);
        setNewEvent({ title: "", description: "", date: "", location: "" });
        setVisualFile(null);
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
        // Upload visual if provided
        if (visualFile) {
          const formData = new FormData();
          formData.append("visual", visualFile);
          formData.append("event_id", editEvent.id);

          await axios.post("http://localhost/upload_visual.php", formData);
        }

        setEvents(
          events.map((event) =>
            event.id === editEvent.id ? { ...editEvent } : event
          )
        );
        setEditEvent(null);
        setVisualFile(null);
        setMessage("Event updated successfully!");
      } else {
        setMessage("Error updating event: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      setMessage("An error occurred while updating the event.");
    }
  };

  const handleViewAttendees = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost/get_attendees.php?event_id=${eventId}`);
      if (response.data.success) {
        setSelectedEventAttendees(response.data.attendees);
        setAttendeeModalOpen(true); // Open the modal
      } else {
        setMessage("No attendees found for this event.");
      }
    } catch (error) {
      console.error("Error fetching attendees:", error);
      setMessage("An error occurred while fetching attendees.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Organizer Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <h2>Your Events</h2>
      {message && <p>{message}</p>}
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.title} - {new Date(event.date).toLocaleString()}
            <button onClick={() => setEditEvent(event)}>Edit</button>
            <button onClick={() => handleViewAttendees(event.id)}>View Attendees</button>
            <button
              onClick={async () => {
                try {
                  await axios.post("http://localhost/delete_event.php", { event_id: event.id });
                  setEvents(events.filter((e) => e.id !== event.id));
                } catch (error) {
                  console.error("Error deleting event:", error);
                }
              }}
            >
              Delete
            </button>
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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setVisualFile(e.target.files[0])}
        />
        <button type="submit">{editEvent ? "Update Event" : "Create Event"}</button>
      </form>

      {attendeeModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Attendees</h2>
            {selectedEventAttendees.length > 0 ? (
              <ul>
                {selectedEventAttendees.map((attendee, index) => (
                  <li key={index}>
                    {attendee.name} ({attendee.email})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No attendees found.</p>
            )}
            <button onClick={() => setAttendeeModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
