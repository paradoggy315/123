import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AllRequests = () => {
  const navigate = useNavigate();
  const [openRequests, setOpenRequests] = useState([]);
  const [fulfilledRequests, setFulfilledRequests] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/requests/events_info')
      .then(response => response.json())
      .then(data => {
        // Filter open and fulfilled requests
        const open = data.filter(request => request.QuantityNeeded > 0);
        const fulfilled = data.filter(request => request.QuantityNeeded === 0);
        setOpenRequests(open);
        setFulfilledRequests(fulfilled);
      })
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

  const renderRequestCards = (requests) => (
    <Row xs={1} md={2} lg={3} className="g-4">
      {requests.map((request) => (
        <Col key={request.RequestID}>
          <Card>
            <Card.Body>
              <Card.Title>{request.Name} for {request.EventName}</Card.Title>
              <Card.Text>
                Quantity Needed: {request.QuantityNeeded} <br />
                Location: {request.Location} <br />
                Event: {request.EventName} <br />
                Date: {formatDate(request.StartDate)}
              </Card.Text>
              <Button variant="primary" onClick={() => goToRequest(request.RequestID)}>View Details</Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <Container>
      <h3>Open Requests</h3>
      {renderRequestCards(openRequests)}

      <h3 className="mt-4">Fulfilled Requests</h3>
      {renderRequestCards(fulfilledRequests)}
    </Container>
  );

  
};

export default AllRequests;
