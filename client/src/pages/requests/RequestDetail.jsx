import React from 'react'
import { useParams } from 'react-router-dom';

const RequestDetail= () => {
    const { requestId } = useParams(); // eventId matches the parameter name in the route path

    // You can now use eventId to fetch data related to that specific disaster event
    // For example, fetch data from an API or use it in a query to your backend
  
    return (
      <div>
        <h1>Disaster Event Details</h1>
        {/* Render your disaster event details using the eventId */}
        <p>Event ID: {requestId}</p>
        {/* More details components */}
      </div>
    );
}

export default RequestDetail