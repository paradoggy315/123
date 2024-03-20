import React from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h2>Forgot Password Page</h2>
      <p>
        Enter your email address below, and we'll send you a link to reset your password.
      </p>
      <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required style={{ margin: '5px 0', padding: '8px' }} />
        <button type="submit" style={{ margin: '10px 0', padding: '10px', backgroundColor: '#3498db', color: '#ffffff', borderRadius: '20px', cursor: 'pointer' }}>
          Reset Password
        </button>
      </form>
      <Link to="/Login" style={{ margin: '10px 0', padding: '10px', backgroundColor: '#7f8c8d', color: '#ffffff', borderRadius: '20px', textDecoration: 'none', alignSelf: 'center' }}>
        Remember your password?
      </Link>
    </div>
  );
};

export default ForgotPassword;

