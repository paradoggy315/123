import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { CheckCircleFill, Circle } from 'react-bootstrap-icons'; // Import both icons

const ManualMatching = () => {
  const [requests, setRequests] = useState([]);
  const [pledges, setPledges] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedPledge, setSelectedPledge] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/requests/events_info')
      .then(res => res.json())
      .then(data => {
        const openRequests = data.filter(request => request.QuantityNeeded > 0);
        setRequests(openRequests);
      })
      .catch(err => console.error("Failed to fetch requests:", err));

    fetch('http://127.0.0.1:5000/pledges')
      .then(res => res.json())
      .then(data => {
        const availablePledges = data.filter(pledge => pledge.PledgeStatus === "Pending"  && pledge.QuantityPledged > 0);
        setPledges(availablePledges);
      })
      .catch(err => console.error("Failed to fetch pledges:", err));
  }, []);

  const toggleRequestSelection = (request) => {
    if (selectedRequest && selectedRequest.RequestID === request.RequestID) {
      setSelectedRequest(null);
    } else {
      setSelectedRequest(request);
    }
  };

  const togglePledgeSelection = (pledge) => {
    if (selectedPledge && selectedPledge.PledgeID === pledge.PledgeID) {
      setSelectedPledge(null);
    } else {
      setSelectedPledge(pledge);
    }
  };

  const handleMatch = () => {
    // Check if the selected request and pledge are for the same item
    if (selectedRequest && selectedPledge && selectedRequest.ItemID !== selectedPledge.ItemID) {
      alert("The items do not match. Please select a request and pledge for the same item.");
      return;
    }

    fetch('http://127.0.0.1:5000/pledges/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: selectedRequest.RequestID, pledgeId: selectedPledge.PledgeID })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(() => {
        alert('Match successfully created and pledge converted to response!');
        setSelectedRequest(null);
        setSelectedPledge(null);
    })
    .catch(err => {
        console.error("Failed to create match and convert pledge:", err);
        alert('Failed to match the pledge to the request.'); // Provide feedback directly in UI.
    });
  };


  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Container>
      <h1>Manual Matching</h1>
      <Row>
        <Col>
          <h2>Open Requests</h2>
          {requests.map(request => (
            <Card
              key={request.RequestID}
              onClick={() => toggleRequestSelection(request)}
              style={{ margin: '10px', cursor: 'pointer', borderColor: selectedRequest?.RequestID === request.RequestID ? 'green' : undefined }}
            >
              <Card.Body>
                {selectedRequest?.RequestID === request.RequestID ? (
                  <CheckCircleFill color="green" size={25} style={{ position: 'absolute', top: 10, right: 10 }} />
                ) : (
                  <Circle color="grey" size={25} style={{ position: 'absolute', top: 10, right: 10 }} />
                )}
                <Card.Title>{request.Name} - {request.Category}</Card.Title>
                <Card.Text>
                  Needed: {request.QuantityNeeded} <br />
                  Location: {request.Location} <br />
                  Event: {request.EventName} <br />
                  Date: {formatDate(request.StartDate)}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Col>
        <Col>
          <h2>Available Pledges</h2>
          {pledges.map(pledge => (
            <Card
              key={pledge.PledgeID}
              onClick={() => togglePledgeSelection(pledge)}
              style={{ margin: '10px', cursor: 'pointer', borderColor: selectedPledge?.PledgeID === pledge.PledgeID ? 'blue' : undefined }}
            >
              <Card.Body>
                {selectedPledge?.PledgeID === pledge.PledgeID ? (
                  <CheckCircleFill color="blue" size={25} style={{ position: 'absolute', top: 10, right: 10 }} />
                ) : (
                  <Circle color="grey" size={25} style={{ position: 'absolute', top: 10, right: 10 }} />
                )}
                <Card.Title>{pledge.ItemName} - {pledge.ItemCategory}</Card.Title>
                <Card.Text>
                  Quantity Pledged: {pledge.QuantityPledged} <br />
                  Donor: {pledge.DonorName} <br />
                  Description: {pledge.ItemDescription}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
      <Button onClick={handleMatch} disabled={!selectedRequest || !selectedPledge}>
        Create Match
      </Button>
    </Container>
  );
};

export default ManualMatching;
