import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, notification, DatePicker } from 'antd';
import { useAuth } from '../auth/AuthContext'; // Adjust this path as necessary

const ManageUserPledges = () => {
  const [pledges, setPledges] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentPledge, setCurrentPledge] = useState({});
  const [form] = Form.useForm();
  const { user } = useAuth(); // Make sure user contains user_id
  const [isShippingModalVisible, setIsShippingModalVisible] = useState(false);
  const [currentShipping, setCurrentShipping] = useState({});
  
  useEffect(() => {
    fetchUserPledges();
  }, [user.user_id]); // Added user.user_id as a dependency

  const fetchUserPledges = () => {
    fetch(`http://127.0.0.1:5000/user/${user.user_id}/pledges`)
      .then(res => res.json())
      .then(data => setPledges(data))
      .catch(() => notification.error({ message: 'Error fetching pledges' }));
  };

  const editPledge = (pledge) => {
    setCurrentPledge(pledge);
    form.setFieldsValue({ QuantityPledged: pledge.QuantityPledged });
    setIsEditModalVisible(true);
  };

  const handleEdit = () => {
    form.validateFields().then(({ QuantityPledged }) => {
      // Construct the full payload with all required fields
      const updatedPledge = {
        UserID: user.user_id, 
        ItemID: currentPledge.ItemID, 
        QuantityPledged: QuantityPledged,
        Status: currentPledge.PledgeStatus, // Assuming you allow editing of status; adjust as needed
      };
  
      // Call API to update the pledge
      fetch(`http://127.0.0.1:5000/pledge/${currentPledge.PledgeID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPledge)
      })
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then(() => {
          notification.success({ message: 'Pledge updated' });
          setIsEditModalVisible(false);
          fetchUserPledges(); // Refresh pledges
        })
        .catch((error) => {
          console.error('Error updating pledge:', error);
          notification.error({ message: 'Error updating pledge' });
        });
    });
  };

  const deletePledge = (PledgeID) => { // Corrected parameter to match casing
    fetch(`http://127.0.0.1:5000/pledge/${PledgeID}`, { method: 'DELETE' })
      .then(() => {
        notification.success({ message: 'Pledge deleted' });
        fetchUserPledges(); // Refresh pledges
      })
      .catch(() => notification.error({ message: 'Error deleting pledge' }));
  };

  const showShippingModal = (pledge) => {
    setCurrentShipping(pledge);
    setIsShippingModalVisible(true);
  };
  
  const handleShip = () => {
    form.validateFields().then(values => {
      const shippingDetails = {
        pledge_id: currentShipping.PledgeID,
        response_id: null,
        carrier: values.carrier,
        tracking_number: values.trackingNumber,
        shipping_date: values.shippingDate.format('YYYY-MM-DD') 
      };
  
      fetch('http://127.0.0.1:5000/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shippingDetails)
      })
      .then(() => {
        notification.success({ message: 'Shipping details added successfully' });
        setIsShippingModalVisible(false);
        fetchUserPledges(); // Refresh pledges
      })
      .catch(error => {
        notification.error({ message: 'Failed to add shipping details' });
        console.error('Error:', error);
      });
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };
  
  const columns = [
    { title: 'Item Name', dataIndex: 'ItemName', key: 'ItemName' },
    { title: 'Quantity Pledged', dataIndex: 'QuantityPledged', key: 'QuantityPledged' },
    { title: 'Status', dataIndex: 'PledgeStatus', key: 'PledgeStatus' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button onClick={() => editPledge(record)}>Edit</Button>
          <Button danger onClick={() => deletePledge(record.PledgeID)}>Delete</Button>
          <Button onClick={() => showShippingModal(record)}>Ship</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>My Pledges</h2>
      <Table dataSource={pledges} columns={columns} rowKey="PledgeID" />
      <Modal title="Edit Pledge" visible={isEditModalVisible} onOk={handleEdit} onCancel={() => setIsEditModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="QuantityPledged" label="Quantity" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="Add Shipping Details" visible={isShippingModalVisible} onOk={handleShip} onCancel={() => setIsShippingModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="carrier" label="Carrier" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="trackingNumber" label="Tracking Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="shippingDate" label="Shipping Date" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageUserPledges;
