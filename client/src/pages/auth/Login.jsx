import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from './AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Login failed. Please try again.');
    })
    .then(data => {
      if (data.token) {
        login(data); // Login with the received token and user info
        navigate('/'); // Redirect to home page on success
      } else {
        setError('Login failed. Please try again.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      setError(error.message);
    });
  };

  // Function to handle navigation to the Register page
  const handleRegisterClick = () => {
    navigate('/register'); // Adjust '/register' as necessary to match your route
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "76vh" }}>
      <Row>
        <Col md={20} className="mx-auto">
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Enter username" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                Login
              </Button>
              <Button variant="secondary" onClick={handleRegisterClick}>
                Register
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
