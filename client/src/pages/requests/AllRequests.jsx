import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AllRequests = () => {
  const navigate = useNavigate();
  const [assistanceRequests, setAssistanceRequests] = useState([]);

  useEffect(() => {
    // Fetch assistance requests. Adjust the endpoint as necessary.
    fetch('http://127.0.0.1:5000/requests/events_info')
      .then(response => response.json())
      .then(data => setAssistanceRequests(data))
      .catch(error => console.error('Error fetching assistance requests:', error));
  }, []);

  const goToRequest = (requestId) => {
    // Navigate to the request detail page. Adjust the path as necessary.
    navigate(`/requests/${requestId}`);
  };

  // Optionally, a function to format dates
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Container>
      <Alert variant="info" className="mt-4">
        All Assistance Requests
      </Alert>
      <Row xs={1} md={2} lg={3} className="g-4">
        {assistanceRequests.map((request) => (
          <Col key={request.RequestID}>
            <Card>
              <Card.Body>
                <Card.Title>Request #{request.RequestID}</Card.Title>
                <Card.Text>
                  Quantity Needed: {request.QuantityNeeded} <br />
                  Location: {request.Location} <br />
                  {/* If you have a date to display, use the formatDate function */}
                  {/* Date: {formatDate(request.SomeDateField)} */}
                </Card.Text>
                <Button variant="primary" onClick={() => goToRequest(request.RequestID)}>View Details</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AllRequests;
