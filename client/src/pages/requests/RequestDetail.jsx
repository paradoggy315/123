import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Alert, ListGroup, Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../auth/AuthContext';

const RequestDetail = () => {
    const { requestId } = useParams();
    const [requestDetail, setRequestDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [responseQuantity, setResponseQuantity] = useState('');

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/requests/${requestId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch request details.');
                }
                return response.json();
            })
            .then(data => {
                setRequestDetail(data[0]); // Assuming the response is an array and we're interested in the first item
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, [requestId]);

    const handleDonorAction = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        // Implement submission logic here
        if (!responseQuantity) {
            alert('Please provide a quantity.');
            return;
        }
        else if (responseQuantity > requestDetail.QuantityNeeded) {
            alert('Quantity provided cannot exceed quantity needed.');
            return;
        }
        else if (responseQuantity <= 0) {
            alert('Quantity provided must be greater than 0.');
            return;
        }
        console.log("Quantity provided:", responseQuantity);
        // Close the modal after submitting
        setShowModal(false);
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
            {user && user.role === 'Donor' && (
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
        </Container>
    );
};

export default RequestDetail;
