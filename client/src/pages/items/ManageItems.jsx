import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, notification } from 'antd';


const ManageItems = () => {
  // Initial fake data
  const initialItems = [
    { id: 1, name: 'Tent', category: 'Equipment', condition: 'New', quantity: 10, location: 'Warehouse 1' },
    { id: 2, name: 'Sleeping Bag', category: 'Equipment', condition: 'Used', quantity: 5, location: 'Warehouse 2' },
    // Add more items as needed
  ];

  const [items, setItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

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
          quantity: item.quantity,
          location: item.location,
          donorId: item.donorId,
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
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Donor ID',
      dataIndex: 'donorId',
      key: 'donorId',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button onClick={() => editItem(record)}>Edit</Button>
          <Button danger onClick={() => deleteItem(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  // Handlers for the modal form
  const editItem = (item) => {
  if (item) {
    setEditingItem(item);
    form.setFieldsValue(item);
  } else {
    // This case is for adding a new item, where we want to reset any existing form values
    form.resetFields();
    setEditingItem(null); // Ensure we're in "add" mode
  }
  setIsModalVisible(true);
};

  const deleteItem = (itemId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this item?',
      content: 'This action cannot be undone.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        // Call the backend API to delete the item
        fetch(`http://127.0.0.1:5000/item/${itemId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          if (!response.ok) throw new Error(response.statusText);
          // Filter out the deleted item from the local state
          setItems(items.filter(item => item.id !== itemId));
          notification.success({
            message: 'Item Deleted',
            description: 'The item has been deleted successfully.',
          });
        })
        .catch(error => {
          notification.error({
            message: 'Error Deleting Item',
            description: 'There was an issue deleting the item.',
          });
        });
      },
    });
  };
  

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        const method = editingItem ? 'PUT' : 'POST';
        const url = editingItem ? `http://127.0.0.1:5000/item/${editingItem.id}` : 'http://127.0.0.1:5000/item'; // Update with the correct API endpoint if needed

        fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        })
          .then(response => {
            if (!response.ok) throw new Error(response.statusText);
            fetchItems(); // Refresh the list
            setIsModalVisible(false);
            notification.success({
              message: 'Success',
              description: `The item has been ${editingItem ? 'updated' : 'added'}.`,
            });
          })
          .catch(error => {
            notification.error({
              message: 'Error',
              description: `There was an issue ${editingItem ? 'updating' : 'adding'} the item.`,
            });
          });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  return (
    <div>
      <h1>Donation Item Management</h1>  
      <Table dataSource={items} columns={columns} rowKey="id" />
      <Modal title="Manage Item" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical" name="itemForm">
            <Form.Item name="name" label="Item Name" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="donorId" label="Donor ID" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
          {/* Add more Form.Items for other fields as needed */}
        </Form>
      </Modal>
      <Button type="primary" onClick={() => editItem(null)}>
        Add New Item
      </Button>
    </div>
  );
};

export default ManageItems;
