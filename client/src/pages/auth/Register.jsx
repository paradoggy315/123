import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, FormGroup } from 'react-bootstrap';

function Register() {
  // State to hold the form data
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '', 
    email: '',
    role: '',
  });
  
  const [passwordValid, setPasswordValid] = useState(true); // true if password meets criteria
  const [showPasswordTip, setShowPasswordTip] = useState(false); // Show password tip if password is invalid  
  const [passwordsMatch, setPasswordsMatch] = useState(null);  //manage the validation status of the password confirmation
  const [error, setError] = useState(''); // Error message from the server
  const navigate = useNavigate(); // Used to redirect the user to another page


  /**
   * Handles the change event of the input fields.
   * Updates the form data state with the new input value.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));

    // If either password or confirmPassword field is updated, check for match
    if (name === 'password' || name === 'confirmPassword') {
      const password = name === 'password' ? value : formData.password;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      setPasswordsMatch(password === confirmPassword);

      // Check password format and display tip if invalid
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
      // Ensure password is not empty and meets criteria
      setPasswordValid(password.length > 0 && passwordRegex.test(password));
    }
    };

  //Handles the form submission for user registration.
  const handleSubmit = (e) => { 
    e.preventDefault();

    setError(''); // Ensure this is used to clear previous errors
 
    const { username, password, confirmPassword, email, role } = formData;
    if (!username || !password || !confirmPassword || !email || !role) {
      setError('Please fill in all fields.');
      return;
    }
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return; // Prevent the form from being submitted
    }

    // Check if password meets the requirements(characters, numbers, special characters, length 8-20 characters long)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be 8-20 characters long and include at least one letter, one number, and one special character.');
      return; // Prevent the form from being submitted
  }

  // Send the form data to the server
  fetch('http://127.0.0.1:5000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
  .then(async response => {
    const data = await response.json(); // Parse JSON data from the response

    if (response.ok) {
      console.log('Success:', data);
      navigate('/'); // Redirect to home page on success
    } else {
      // Handle server-side validation errors (e.g., username or email not unique)
      if (data.error) {
        setError(data.error); // Assumes the backend sends an error field in case of validation failure
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    setError(error.message); // Update the state to show error message
  });
};

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row>
        <Col md={15} className="mx-auto">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label> 
              <Form.Control 
                type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleChange} 
                placeholder="Enter username" 
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                onFocus={() => setShowPasswordTip(true)}
                onBlur={() => setShowPasswordTip(false)}
                placeholder="Password"
                isInvalid={!passwordValid && showPasswordTip}
                isValid={passwordValid && showPasswordTip}
              />
              {showPasswordTip && (
                <Form.Text className="text-muted">
                  Password must be:
                  <br />- 8-20 characters long
                  <br />- Include at least one letter
                  <br />- Include at least one number
                  <br />- Include at least one special character
                </Form.Text>
              )}
              <Form.Control.Feedback type="invalid">
                Password does not meet requirements.
              </Form.Control.Feedback>
              <Form.Control.Feedback type="valid">
                Password looks good!
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                isInvalid={passwordsMatch === false}
                isValid={passwordsMatch}
              />
              <Form.Control.Feedback type="invalid">
                Passwords do not match.
              </Form.Control.Feedback>
              <Form.Control.Feedback type="valid">
                Passwords match.
              </Form.Control.Feedback>
            </Form.Group>


            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Enter email" 
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicRole">
              <Form.Label>Role</Form.Label>
              <Form.Control 
                as="select" 
                name="role" 
                value={formData.role} 
                onChange={handleChange}>
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="donor">Donor</option>
                <option value="recipient">Recipient</option>
            </Form.Control>
            </Form.Group>

            <Form.Group>
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
