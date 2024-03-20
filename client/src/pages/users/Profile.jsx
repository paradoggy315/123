import React, { useState, useEffect } from 'react';
// Import the necessary Ant Design components
import { Button } from 'antd';
// Import icons from Ant Design
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const Profile = () => {
  // State to hold the user's role
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    
    // Temporarily setting a role for testing purposes
    setUserRole('Admin'); // Set this to 'Donor', 'Recipient', or 'Volunteer' as needed
  }, []);

  const handleManageItemsClick = () => {
    navigate('/item-management'); 
  };

  return (
    <div style={{ margin: '20px' }}>
      <h1><UserOutlined /> My Profile</h1>
      <p>Here you can manage your account settings and view your activity.</p>

      {/* Conditionally render the Manage Donation Items button if the user is an Admin */}
      {userRole === 'Admin' && (
        <Button type="primary" icon={<EditOutlined />} onClick={handleManageItemsClick}>
          Manage Donation Items
        </Button>
      )}

      {/* Add more profile details and functionality here */}
    </div>
  );
};

export default Profile;