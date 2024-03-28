import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { UserOutlined, EditOutlined, HomeOutlined, SolutionOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';


const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleManageItemsClick = () => {
    navigate('/item-management');
  };

  const handleManagePledgesClick = () => {
    navigate('/manage-pledges'); // Navigate to the manage pledges page
  };

  const handleCreatePledgesClick = () => {
    navigate('/create-pledges'); // Navigate to the create pledges page
  };

  const handleAddDefaultAddress = async () => {
    // Example default address data
    const defaultAddress = {
      address: '123 Main St',
      country: 'CountryName',
      state: 'StateName',
      zip_code: 'ZipCode',
      region: 'RegionName'
    };

    try {
      const response = await fetch(`http://127.0.0.1:5000/users/update-address/${user.user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(defaultAddress),
      });

      if (!response.ok) {
        throw new Error('Failed to update address');
      }

      alert('Default address added successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating address');
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h1><UserOutlined /> My Profile</h1>
      <p>Here you can manage your account settings and view your activity.</p>

      {user.role === 'Admin' && (
        <Button type="primary" icon={<EditOutlined />} onClick={handleManageItemsClick}>
          Manage Donation Items
        </Button>
      )}

      {/* Conditionally render the Manage My Pledges button if the user is a Donor */}
      {user && user.role === 'Donor' && (
        <Button type="primary" icon={<SolutionOutlined />} onClick={handleCreatePledgesClick}>
          Create Pledges
        </Button>
      )}
      {user && user.role === 'Donor' && (
        <Button type="primary" icon={<SolutionOutlined />} onClick={handleManagePledgesClick} style={{ marginLeft: '10px' }}>
          Manage My Pledges
        </Button>
      )}
      <Button type="default" icon={<HomeOutlined />} onClick={handleAddDefaultAddress} style={{ marginLeft: '10px' }}>
        Add Default Address
      </Button>

      {/* Add more profile details and functionality here */}
    </div>
  );
};

export default Profile;
