import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Alert, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Home() {

  const navigate = useNavigate();

  const [disasterEvents, setDisasterEvents] = useState([]); // State for disaster events
  const [assistanceRequests, setAssistanceRequests] = useState([]); // State for assistance requests

  // Placeholder data - replace with actual data fetch in the future
  useEffect(() => {
    // Fetch disaster events
    fetch('http://127.0.0.1:5000/disaster_events')
      .then(response => response.json())
      .then(data => setDisasterEvents(data))
      .catch(error => console.error('Error fetching disaster events:', error));


    //Fetch assistance requests
    fetch('http://127.0.0.1:5000/requests/events_info')
      .then(response => response.json())
      .then(data => setAssistanceRequests(data))
      .catch(error => console.error('Error fetching assistance requests:', error));
  }, []);

  const goToDisasterEvent = (eventId) => {
    // Navigate to the disaster event detail page
    navigate(`/disasters/${eventId}`);
  };

  const goToRequest = (requestId) => {
    // Navigate to the request detail page
    navigate(`/requests/${requestId}`);
  };

  const viewAllDisasters = () => {
    // Redirect to the page that shows all disaster events
    navigate('/disasters');
  };

  const viewAllRequests = () => {
    // Redirect to the page that shows all assistance requests
    navigate('/requests');
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <>
      <Container>
        <Alert variant="info">
          Important Announcement: Welcome to the Disaster Assistance Management System. Stay informed and stay safe.
        </Alert>

        <h2>Current Disaster Events</h2>
        <Row xs={1} md={2} lg={4} className="g-4">
          {disasterEvents.map(event => (
            <Col key={event.EventID}>
              <Card className="mb-2">
                <Card.Body>
                  <Card.Title>{event.EventName}</Card.Title>
                  <Card.Text>
                    Location: {event.Location} <br />
                    Date: {formatDate(event.StartDate)}
                  </Card.Text>
                  <Button variant="primary" onClick={() => goToDisasterEvent(event.EventID)}>
                    Learn More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="d-flex justify-content-end mb-4">
          <Button variant="secondary" onClick={viewAllDisasters}>View All Disasters</Button>
        </div>

        <h2>Requests for Assistance</h2>
        <Row xs={1} md={2} lg={4} className="g-4">
          {assistanceRequests.map(request => (
            <Col key={request.RequestID}>
              <Card className="mb-2">
                <Card.Body>
                  <Card.Title>{request.UnitType}</Card.Title>
                  <Card.Text>
                    Quantity Needed: {request.QuantityNeeded} <br />
                    Location: {request.Location} <br />
                    Event: {request.EventName} <br />
                    Date: {formatDate(request.StartDate)}
                  </Card.Text>
                  <Button variant="success" onClick={() => goToRequest(request.RequestID)}>
                    Respond
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="d-flex justify-content-end mb-4">
          <Button variant="secondary" onClick={viewAllRequests}>View All Requests</Button>
        </div>
      </Container>
    </>
  );

}

export default Home