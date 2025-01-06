/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Table, Button, Modal, Form, Input, Select, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { EditOutlined } from "@ant-design/icons";
import { User } from '../../../types';
import useUserAccounts from './useUserAccounts';

const { Option } = Select;

export const UserAccounts: React.FC = () => {
  const {
    handleFinish,
    openModal,
    closeModal,
    handleTypeChange,
    accounts,
    editingUser,
    isLoading,
    isModalVisible,
    form,
  } = useUserAccounts();

  const columns = [
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Team', dataIndex: ['teamInfo','teamName'], key: 'collegeName', render:(v:any) => v !== 'undefined' ? v : '-' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Added By', dataIndex: 'addedByUsername', key: 'addedByUsername' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, user: User) => (
        <div className="flex space-x-2">
          <Tooltip title="Edit User">
            <Button 
              type="text"
              icon={<EditOutlined className="text-sky-600" />} 
              onClick={() => openModal(user)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">User Accounts</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => openModal()}
          style={{ backgroundColor: '#064518', marginBottom: 16 }}
        >
          Add User
        </Button>
      </div>
      <Table 
        dataSource={accounts} 
        columns={columns} 
        rowKey="id"
        bordered
        pagination={{
          pageSize: 10,
          position: ["bottomRight"],
          showSizeChanger: false,
          className: "rounded-full",
          showTotal: (total) => `Total ${total} accounts`
        }}
        className="border rounded-lg overflow-hidden"
        style={{ 
          border: '1px solid #d9d9d9',
        }}
      />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={isModalVisible}
        onCancel={closeModal}
        onClose={closeModal}
        footer={null}
      >
        <Form
          initialValues={{
            teamId: null,
            event: null,
            sportEvent: null,
            ...editingUser,
          }}
          onFinish={handleFinish}
          layout="vertical"
          form={form}
        >
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter a username' }]}>
            <Input />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter a password' }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          {editingUser && (
            <Form.Item name="password" label="Password">
              <Input.Password placeholder="Leave blank to keep the current password" />
            </Form.Item>
          )}

          <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please select a type' }]}>
            <Select onChange={handleTypeChange}>
              <Option value="Admin">Admin</Option>
              <Option value="Coach">Coach</Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select a status' }]}>
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item className="flex justify-end">
            <Button 
              type="primary" 
              loading={isLoading} 
              htmlType="submit" 
              style={{ backgroundColor: '#064518' }}
            >
              {editingUser ? 'Update User' : 'Add User'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
