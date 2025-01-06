import React from "react";
import { Card, Button, Modal, Popconfirm, Row, Col, Tooltip } from "antd";
import { Events } from "../../../types";
import TeamsForm from "./form";
import useEventsHooks from "./useEventsHooks";
import { dateFormatter } from "../../../utility/utils";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

export const EventsPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    Events,
    isModalVisible,
    editingEvents,
    form,
    loading,
    handleAddOrEditEvent,
    setIsModalVisible,
    handleDeleteEvents,
    showModal,
  } = useEventsHooks();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Events Management</h1>
        <Button
          type="primary"
          onClick={() => showModal()}
          style={{ backgroundColor: '#064518', marginBottom: 16 }}
          icon={<PlusOutlined />}
        >
          Add Event
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {Events?.map((event: Events) => (
          <Col xs={24} sm={12} md={8} lg={6} key={event.eventId}>
            <Card
              title={event.eventName}
              bordered={true}
              actions={[
                <Tooltip title="View Event Details" key="view">
                  <EyeOutlined onClick={() => navigate(`/Events/${event.eventId}`)} style={{ color: '#064518' }} />
                </Tooltip>,
                <Tooltip title="Edit Event" key="edit">
                  <EditOutlined onClick={() => showModal(event)} style={{ color: '#1890ff' }} />
                </Tooltip>,
                <Tooltip title="Delete Event" key="delete">
                  <Popconfirm
                    title="Are you sure to delete this event?"
                    onConfirm={() => handleDeleteEvents(event.eventId)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <DeleteOutlined style={{ color: 'red' }} />
                  </Popconfirm>
                </Tooltip>
              ]}
            >
              <p><strong>Start Date:</strong> {dateFormatter(event.eventstartDate)}</p>
              <p><strong>End Date:</strong> {dateFormatter(event.eventendDate)}</p>
              <p><strong>Added by:</strong> {event.createdByName}</p>
              <p><strong>Updated by:</strong> {event.updatedByName}</p>
              <div dangerouslySetInnerHTML={{__html:event.description}} />
            </Card>
          </Col>
        ))}
      </Row>

      {isModalVisible && (
        <Modal
          title={<span style={{ color: editingEvents ? '#1890ff' : '#064518' }}>{editingEvents ? "Edit Event" : "Add Event"}</span>}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <TeamsForm
            form={form}
            loading={loading}
            handleAddOrEditEvent={handleAddOrEditEvent}
            editingEvents={editingEvents}
          />
        </Modal>
      )}
    </div>
  );
};
