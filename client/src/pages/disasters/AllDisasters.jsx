import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; // Make sure this path is correct

const AllDisasterEvents = () => {
  const [disasterEvents, setDisasterEvents] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth(); // Destructure to get the user object from auth

  useEffect(() => {
    fetchDisasterEvents();
  }, []);

  const fetchDisasterEvents = () => {
    fetch('http://127.0.0.1:5000/disaster_events')
      .then(response => response.json())
      .then(data => setDisasterEvents(data))
      .catch(error => console.error('Error fetching disaster events:', error));
  };

  const goToDisasterEvent = (eventId) => {
    navigate(`/disasters/${eventId}`);
  };

  const goToAddDisasterEvent = () => {
    navigate('/addDisasterEvent'); // Navigate to the add disaster event page
  };

  const addRequest = (eventId, eventName, eventLocation) => {
    navigate(`/add-requests`, { state: { eventId, eventName, eventLocation} }); // Adjust this URL as necessary
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Container>
      <Alert variant="info" className="mt-4">
        Disaster Events Overview
      </Alert>
      <Row xs={1} md={2} lg={4} className="g-4">
        {disasterEvents.map((event) => (
          <Col key={event.EventID}>
            <Card>
              <Card.Body>
                <Card.Title>{event.EventName}</Card.Title>
                <Card.Text>
                  <strong>Location:</strong> {event.Location}<br/>
                  <strong>Date:</strong> {formatDate(event.StartDate)}
                </Card.Text>
                <Button variant="primary" onClick={() => goToDisasterEvent(event.EventID)} className="me-2">
                  View Details
                </Button>

                {user && (
                  <Button variant="secondary" onClick={() => addRequest(event.EventID, event.EventName, event.Location)}>
                  Add Request
                  </Button>
                  )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="d-flex justify-content-center mt-4">
        <Button onClick={goToAddDisasterEvent} variant="success">Add Disaster Event</Button>
      </div>
    </Container>
  );
};

export default AllDisasterEvents;
