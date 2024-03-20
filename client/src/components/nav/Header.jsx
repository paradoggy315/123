import { HomeTwoTone, EditTwoTone, CheckCircleTwoTone, ProfileTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { Menu } from 'antd';
import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../pages/auth/AuthContext'; // Ensure this path matches your file structure

const Header = () => {
  const { user, logout } = useAuth(); // This hook provides the current user and logout function
  const [current, setCurrent] = useState('h');

  const isLoggedIn = user !== null; // Determine if logged in based on the presence of user data

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const handleLogout = () => {
    logout(); // Logout the user using the logout function from useAuth
    console.log("User logged out");
    // Optionally, redirect the user to the homepage or login page after logging out
  };

  return (
    <>
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal">
        <Menu.Item key="h" icon={<HomeTwoTone />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="title" disabled>
          <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginRight: -1 }}>Disaster Assistance Management System</div>
        </Menu.Item>
        {/* Conditional rendering based on isLoggedIn */}
        {isLoggedIn ? (
          <>
            <Menu.Item key="profile" icon={<ProfileTwoTone />} style={{ marginLeft: 'auto' }}>
              <Link to="/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item key="logout" icon={<CloseCircleTwoTone />}>
              <a onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</a> {/* Use cursor pointer for better UX */}
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item key="r" icon={<EditTwoTone />} style={{ marginLeft: 'auto' }}>
              <Link to="/register">Register</Link>
            </Menu.Item>
            <Menu.Item key="l" icon={<CheckCircleTwoTone />}>
              <Link to="/login">Login</Link>
            </Menu.Item>
          </>
        )}
      </Menu>
      <Outlet/>
    </>
  );
};

export default Header;
