import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./styles.css";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState("");
  const userId = localStorage.getItem("user_id"); // Assume user_id is stored in localStorage

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost/get_event_details.php?id=${id}`);
        setEvent(response.data);
      } catch (err) {
        setMessage("Error fetching event details");
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleRSVP = async () => {
    try {
      const response = await axios.post("http://localhost/rsvp_event.php", {
        event_id: id,
        user_id: userId,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error processing RSVP");
    }
  };

  if (!event) {
    return <p>Loading event details...</p>;
  }

  return (
    <div className="event-details">
      <h1 className="event-title">{event.title}</h1>
      <p className="event-description">{event.description}</p>
      <p>
        <strong>Date:</strong> {new Date(event.date).toLocaleString()}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      {event.visual && (
        <div className="event-visual-container">
          <img
            src={`http://localhost/${event.visual}`}
            alt={event.title}
            className="event-visual"
          />
        </div>
      )}
      <button onClick={handleRSVP} className="rsvp-button">
        RSVP
      </button>
      {message && <p className="event-message">{message}</p>}
    </div>
  );
};

export default EventDetails;
