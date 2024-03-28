import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Alert, ListGroup, Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../auth/AuthContext';

const RequestDetail = () => {
    const { requestId } = useParams();
    const [requestDetail, setRequestDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [responseQuantity, setResponseQuantity] = useState('');
    const [userDetails, setUserDetails] = useState(null);
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        // Fetch Request Details
        const fetchRequestDetails = async () => {
          try {
            const response = await fetch(`http://127.0.0.1:5000/requests/${requestId}`);
            if (!response.ok) {
              throw new Error('Failed to fetch request details.');
            }
            const data = await response.json();
            setRequestDetail(data[0]); // Assuming the response is an array and we're interested in the first item
          } catch (error) {
            setError(error.message);
          }
        };
      
        // Fetch Responses for the Request
        const fetchResponses = async () => {
          try {
            const response = await fetch(`http://127.0.0.1:5000/responses/request/${requestId}`);
            if (!response.ok) {
              throw new Error('Failed to fetch responses.');
            }
            const data = await response.json();
            setResponses(data);
          } catch (error) {
            console.error('Error fetching responses:', error);
          }
        };
      
        // Ensure requestId is available
        if (requestId) {
          setLoading(true); // Set loading state
          fetchRequestDetails();
          fetchResponses();
          setLoading(false); // Reset loading state once both fetch operations are complete
        }
      }, [requestId]);

    useEffect(() => {
      const fetchUserDetails = async () => {
          try {
              const response = await fetch(`http://127.0.0.1:5000/users/${user.user_id}`);
              if (!response.ok) {
                  throw new Error('Failed to fetch user details.');
              }
              const userData = await response.json();
              setUserDetails(userData[0]); // Assuming the response is an array and we're interested in the first item
          } catch (error) {
              console.error('Error fetching user details:', error);
          }
      };
  
      if (user) {
          fetchUserDetails();
      }
  }, [user, showModal]);

    const handleDonorAction = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleFormSubmit = async (event) => {
      event.preventDefault();
  
      // Validation logic
      if (!responseQuantity) {
          alert('Please provide a quantity.');
          return;
      } else if (responseQuantity > requestDetail.QuantityNeeded) {
          alert('Quantity provided cannot exceed quantity needed.');
          return;
      } else if (responseQuantity <= 0) {
          alert('Quantity provided must be greater than 0.');
          return;
      } else if (!userDetails || !userDetails.Address || !userDetails.ZipCode) {
          alert('You must have a valid address to respond to a request.');
          return;
      }
  
      // Prepare the response data
      const responseData = {
          user_id: user.user_id,
          matched_request_id: requestDetail.RequestID,
          quantity_provided: responseQuantity,
          status: 'Shipped', // or any default status you want to set
      };
  
      try {
          // Make an API call to the submit-response endpoint
          const response = await fetch('http://127.0.0.1:5000/add-response', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(responseData),
          });
  
          // Check if the response was successful
          if (response.ok) {
              alert('Response submitted successfully');
              // Close the modal after submitting
              setShowModal(false);
          } else {
              // If we hit an API error
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to submit the response');
          }
      } catch (error) {
          console.error('Submission error:', error);
          alert(error.toString());
      }
  };

    if (loading) return <Alert variant="info">Loading...</Alert>;
    if (error) return <Alert variant="danger">Error: {error}</Alert>;
    if (!requestDetail) return <Alert variant="warning">Request details not found.</Alert>;

    return (
        <Container>
            <h1>Request Detail</h1>
            <ListGroup>
                <ListGroup.Item><strong>Event Name:</strong> {requestDetail.EventName}</ListGroup.Item>
                <ListGroup.Item><strong>Item Name:</strong> {requestDetail.ItemName}</ListGroup.Item>
                <ListGroup.Item><strong>Category:</strong> {requestDetail.Category}</ListGroup.Item>
                <ListGroup.Item><strong>Description:</strong> {requestDetail.ItemDescription}</ListGroup.Item>
                <ListGroup.Item><strong>Quantity Needed:</strong> {requestDetail.QuantityNeeded}</ListGroup.Item>
                <ListGroup.Item><strong>Status:</strong> {requestDetail.Status}</ListGroup.Item>
                <ListGroup.Item><strong>Location:</strong> {requestDetail.Location}</ListGroup.Item>
                <ListGroup.Item><strong>Start Date:</strong> {new Date(requestDetail.StartDate).toLocaleDateString()}</ListGroup.Item>
                <ListGroup.Item><strong>Create Date:</strong> {new Date(requestDetail.CreateDate).toLocaleString()}</ListGroup.Item>
            </ListGroup>
            {user && requestDetail.Status !== "Fulfilled" && user.role === 'Donor' && (
                <Button variant="primary" onClick={handleDonorAction}>
                    Respond to Request
                </Button>
            )}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Respond to Request</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleFormSubmit}>
                <Modal.Body>
                    <ListGroup className="mb-3">
                        <ListGroup.Item><strong>Event Name:</strong> {requestDetail.EventName}</ListGroup.Item>
                        <ListGroup.Item><strong>Item Name:</strong> {requestDetail.ItemName}</ListGroup.Item>
                        <ListGroup.Item><strong>Location:</strong> {requestDetail.Location}</ListGroup.Item>
                        <ListGroup.Item><strong>Quantity Needed:</strong> {requestDetail.QuantityNeeded}</ListGroup.Item>
                        {/* Display user's shipping info */}
                        {userDetails && (
                            <>
                                <ListGroup.Item><strong>Shipping From:</strong> {userDetails.Address}, {userDetails.ZipCode}, {userDetails.City}, {userDetails.State}, {userDetails.Country}</ListGroup.Item>
                            </>
                        )}
                    </ListGroup>
                    <Form.Group className="mb-3" controlId="responseQuantity">
                        <Form.Label>Quantity You Plan to Provide</Form.Label>
                        <Form.Control 
                            type="number" 
                            value={responseQuantity} 
                            onChange={(e) => setResponseQuantity(e.target.value)}
                            required 
                        />
                    </Form.Group>
                </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Submit Response
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <h2>Responses</h2>
            {responses.length > 0 ? (
                <Row xs={1} md={2} lg={4} className="g-4">
                    {responses.map((response) => (
                        <Col key={response.ResponseID}>
                            <Card className="mb-2">
                                <Card.Body>
                                    <Card.Title>From: {response.UserName || "Anonymous"}</Card.Title>
                                    <Card.Text>
                                        <strong>Quantity Provided:</strong> {response.QuantityProvided}<br />
                                        <strong>Status:</strong> {response.ResponseStatus}<br />
                                        <strong>Shipping From:</strong> {response.ShippingFrom}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Alert variant="info">No responses yet.</Alert>
            )}
        </Container>
    );
};

export default RequestDetail;
