import React, { useState } from 'react';
import { Form, Button, Alert, Container, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { useAuth } from '../auth/AuthContext'; 
import { useLocation } from 'react-router-dom';

const AddRequests = () => {

  const { user } = useAuth();
  const location = useLocation(); // Corrected variable name here

  const initialFormState = {
    eventName: location.state?.eventName || '',
    itemName: '',
    itemCategory: '',
    itemDescription: '',
    quantityNeeded: '',
    donorId: user.user_id,
    location: location.state?.eventLocation || '', // Corrected to use `location`
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First, create the item
      const itemResponse = await fetch('http://127.0.0.1:5000/item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.itemName,
          category: formData.itemCategory,
          description: formData.itemDescription,
          quantity: formData.quantityNeeded, 
          donorId: user.user_id,
          location: formData.location,
        }),
      });

      if (!itemResponse.ok) {
        throw new Error('Failed to create item');
      }

      const itemData = await itemResponse.json();
      console.log('Item created:', itemData);

      const itemId = itemData[0].item_id;

      // Then, create the request with the item ID from the previous response
      const requestResponse = await fetch('http://127.0.0.1:5000/add-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: location.state?.eventId, // Use the event ID from the location state
          user_id: user.user_id, // Use the logged-in user's ID
          item_id: itemId, // Use the ID returned from the item creation
          quantity_needed: formData.quantityNeeded,
          status: 'Open',
          create_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        }),
      });

      if (!requestResponse.ok) {
        throw new Error('Failed to create request');
      }

      alert('Request added successfully!');
      // Reset form or redirect user as necessary
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <Container>
      <h2>Create Request for {location.state?.eventName}</h2> {/* Display event name */}
      <Alert variant="secondary" className="mt-4">
        Location: {location.state?.eventLocation} {/* Display event location */}
      </Alert>
      <Form onSubmit={handleSubmit}>
    {/* Item Name */}
    <FormGroup className="mb-3">
      <FormLabel>Item Name</FormLabel>
      <FormControl
        type="text"
        name="itemName"
        value={formData.itemName}
        onChange={handleChange}
        required
      />
    </FormGroup>

    {/* Item Category */}
    <FormGroup className="mb-3">
      <FormLabel>Item Category</FormLabel>
      <FormControl
        type="text"
        name="itemCategory"
        value={formData.itemCategory}
        onChange={handleChange}
        required
      />
    </FormGroup>

    {/* Item Description */}
    <FormGroup className="mb-3">
      <FormLabel>Item Description</FormLabel>
      <FormControl
        as="textarea"
        name="itemDescription"
        value={formData.itemDescription}
        onChange={handleChange}
        required
      />
    </FormGroup>

    {/* Quantity Needed */}
    <FormGroup className="mb-3">
      <FormLabel>Quantity Needed</FormLabel>
      <FormControl
        type="number"
        name="quantityNeeded"
        value={formData.quantityNeeded}
        onChange={handleChange}
        required
      />
    </FormGroup>

    {/* Location - This might be redundant since you have an event location displayed above. Adjust as needed. */}
    <FormGroup className="mb-3">
      <FormLabel>Request Location</FormLabel>
      <FormControl
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        required
      />
    </FormGroup>

    <Button variant="primary" type="submit">Submit Request</Button>
  </Form>
    </Container>
  );
};  

export default AddRequests;
