import React, { useState } from 'react';
import { Form, Button, Container, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { useAuth } from '../auth/AuthContext'; 
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



const AddDisaster = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const initialFormState = {
    eventId: '',
    eventName: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    //adminID: user.user_id,
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
      // Example of submitting to an API endpoint
      const response = await fetch('http://127.0.0.1:5000/addDisasterEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: formData.eventId,
          eventName: formData.eventName,
          location: formData.location,
          startDate: formData.startDate,
          //when the ability to edit disasters is created, make sure to edit the 
          //above variable because the date is actually one day behind the 
          //created start date
          endDate: formData.endDate,
          description: formData.description,
          // adminID: user.user_id,

        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add disaster');
      }

      const data = await response.json();
      console.log('Disaster added:', data);

      alert('Disaster Added Successfully!')


      // Redirect to /disasters page after successful submission
      navigate('/disasters');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };
  return (
    <Container>
      <h2>Add New Disaster Event</h2>
      <Form onSubmit={handleSubmit}>
        {/* Event Name */}
        <FormGroup className="mb-3">
          <FormLabel>Event Name</FormLabel>
          <FormControl
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            required
          />
        </FormGroup>

        {/* Location */}
        <FormGroup className="mb-3">
          <FormLabel>Location</FormLabel>
          <FormControl
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </FormGroup>

        {/* Start Date */}
        <FormGroup className="mb-3">
          <FormLabel>Start Date</FormLabel>
          <FormControl
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </FormGroup>

        {/* End Date */}
        <FormGroup className="mb-3">
          <FormLabel>End Date</FormLabel>
          <FormControl
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </FormGroup>

        {/* Description */}
        <FormGroup className="mb-3">
          <FormLabel>Description</FormLabel>
          <FormControl
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <Button variant="primary" type="submit">Create Disaster Event</Button>
      </Form>
    </Container>
  );
};  

export default AddDisaster;
