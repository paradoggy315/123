import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './pages/auth/AuthContext';
import ProtectedRoute  from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Header from './components/nav/Header';
import Disaster from './pages/disasters/Disaster';
import RequestDetail from './pages/requests/RequestDetail'; // Import your request detail component
import AllDisasters from './pages/disasters/AllDisasters';
import AllRequests from './pages/requests/AllRequests'; // Import your all requests component
import Profile from './pages/users/Profile'; // Import your profile component
import ManageItems from './pages/items/ManageItems'; // Import your item masnagement component
import AddRequests from './pages/requests/AddRequests';
import AddDisaster from './pages/disasters/AddDisaster';
import AddResponse from './pages/responses/AddResponse';
import CreatePledge from './pages/pledges/CreatePledges';
import ManageUserPledges from './pages/pledges/UserPledges'; // Import your manage user pledges component 
import ManualMatching from './pages/matches/ManualMatches'; // Import your manual matching component



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Header />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="disasters/:eventId" element={<Disaster />} />
      <Route path="requests/:requestId" element={<RequestDetail />} />
      <Route path="disasters" element={<AllDisasters />} />
      <Route path="requests" element={<AllRequests />} />
      <Route path="add-requests" element={<AddRequests />} />
      <Route 
        path="add-response" 
        element={
          <ProtectedRoute requiredRole="Donor">
            <AddResponse />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="item-management" 
        element={
          <ProtectedRoute requiredRole="Admin">
            <ManageItems />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="addDisasterEvent" 
        element={
          <ProtectedRoute requiredRole="Admin">
            <AddDisaster />
          </ProtectedRoute>
        } 
      />
      <Route path="profile" element={<Profile />} />
      <Route path="item-management" element={<ManageItems />} />
      <Route path="*" element={<div>Not Found</div>} />
      <Route 
        path="create-pledges" 
        element={
          <ProtectedRoute requiredRole="Donor">
            <CreatePledge  />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="manage-pledges" 
        element={
          <ProtectedRoute requiredRole="Donor">
            <ManageUserPledges />
          </ProtectedRoute>
        }
      />
      <Route 
        path="manual-matching" 
        element={
          <ProtectedRoute requiredRole="Admin">
            <ManualMatching />
          </ProtectedRoute>
        } 
      />

    </Route>
  )
)

function App({routes}) {

  return (
    <>
      <AuthProvider>
        <RouterProvider router={router}/> 
      </AuthProvider>
    </>
  );
}

export default App;