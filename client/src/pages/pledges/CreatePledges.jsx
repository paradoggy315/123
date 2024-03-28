import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, notification } from 'antd';
import { useAuth } from '../auth/AuthContext'; 
import { ModalBody } from 'react-bootstrap';

const CreatePledge = () => {
  const [items, setItems] = useState([]);
  const [isPledgeModalVisible, setIsPledgeModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form] = Form.useForm();
  const { user } = useAuth();


  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    fetch('http://127.0.0.1:5000/items')
      .then(response => response.json())
      .then(data => {
        const transformedItems = data.map(item => ({
          id: item.ItemID,
          name: item.Name,
          category: item.Category,
          description: item.Description,
        }));
        setItems(transformedItems);
      })
      .catch(error => {
        notification.error({
          message: 'Error Fetching Items',
          description: 'There was an issue retrieving the items.',
        });
      });
  };

  // Column configuration for the table
  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type = "primary" onClick={() => makePledge(record)}>Make Pledge</Button>
      ),
    },
  ];

  const makePledge = (item) => {
    setSelectedItem(item);
    form.resetFields();
    setIsPledgeModalVisible(true);
  };

  const handlePledgeOk = () => {
    form.validateFields()
      .then(values => {
        const url = 'http://127.0.0.1:5000/pledge';

        const pledgeData = {
          ItemID: selectedItem.id,
          QuantityPledged: values.quantity,
          UserID: user.user_id, // Assuming UserID and Status are managed elsewhere or are part of the form
          Status: 'Pending',  
          // Assuming UserID and Status are managed elsewhere or are part of the form
        };

        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pledgeData),
        })
          .then(response => {
            if (!response.ok) throw new Error(response.statusText);
            notification.success({
              message: 'Pledge Made',
              description: 'Your pledge has been made successfully.',
            });
            setIsPledgeModalVisible(false);
            form.resetFields();
          })
          .catch(error => {
            notification.error({
              message: 'Error Making Pledge',
              description: 'There was an issue making the pledge.',
            });
          });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handlePledgeCancel = () => {
    setIsPledgeModalVisible(false);
  };

  return (
    <div>
      <h1>Items</h1>  
      <Table dataSource={items} columns={columns} rowKey="id" />
      <Modal title="Make a Pledge" visible={isPledgeModalVisible} onOk={handlePledgeOk} onCancel={handlePledgeCancel}>
        <ModalBody>
          <p>You are pledging to donate {selectedItem?.name}.</p>
          <p>Category: {selectedItem?.category}</p>
          <p>Description: {selectedItem?.description}</p>
        </ModalBody>
        <Form form={form} layout="vertical" name="pledgeForm">
            <Form.Item name="quantity" label="Pledge Quantity" rules={[{ required: true, message: 'Please input the quantity you want to pledge!' }]}>
                <Input type="number" />
            </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreatePledge;
