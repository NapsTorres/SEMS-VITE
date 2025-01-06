import React from "react";
import { Card, Button, Modal, Popconfirm, Image, Row, Col, Tooltip } from "antd";
import useTeamsHooks from "./useSportsHooks";
import { Sports } from "../../../types";
import SportsForm from "./form";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export const SportsPage: React.FC = () => {
  const {
    handleAddOrEditTeam,
    showModal,
    handleDeleteTeam,
    setIsModalVisible,
    setIsImageUpdated,
    isModalVisible,
    Sports,
    editingSports,
    form,
    loading
  } = useTeamsHooks();
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Sports Management</h1>
        <Button
          type="primary"
          onClick={() => showModal()}
          style={{ backgroundColor: '#064518', marginBottom: 16 }}
          icon={<PlusOutlined />}
        >
          Add Sports
        </Button>
      </div>

      {/* Grid layout for displaying cards */}
      <Row gutter={[16, 16]}>
        {Sports?.map((sport: Sports) => (
          <Col xs={24} sm={12} md={8} lg={6} key={sport.sportsId}>
            <Card
              hoverable
              cover={<Image alt={sport.sportsName} src={sport.sportsLogo} style={{ height: 150, objectFit: 'contain' }} />}
              actions={[
                <Tooltip title="Edit Sport" key="edit">
                  <EditOutlined onClick={() => showModal(sport)} style={{ color: '#1890ff' }} />
                </Tooltip>,
                <Tooltip title="Delete Sport" key="delete">
                  <Popconfirm
                    title="Are you sure to delete this sports?"
                    onConfirm={() => handleDeleteTeam(sport.sportsId)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <DeleteOutlined style={{ color: '#ff4d4f' }} />
                  </Popconfirm>
                </Tooltip>
              ]}
            >
              <Card.Meta
                title={sport.sportsName}
                description={<div className="line-clamp-3" dangerouslySetInnerHTML={{__html:sport.description}} />}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for Add/Edit Sports */}
      {isModalVisible && (
        <Modal
          title={<span style={{ color: editingSports ? '#1890ff' : '#064518' }}>{editingSports ? "Edit Sport" : "Add Sport"}</span>}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <SportsForm
            form={form}
            loading={loading}
            setIsImageUpdated={setIsImageUpdated}
            handleAddOrEditTeam={handleAddOrEditTeam}
            editingSports={editingSports}
          />
        </Modal>
      )}
    </div>
  );
};
