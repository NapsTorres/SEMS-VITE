/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Typography,
  Card,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Popconfirm,
  Image,
  Tooltip,
  Select,
} from "antd";
import { InboxOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import useCoach from "../useCoach";

const { Title } = Typography;
const { Dragger } = Upload;
const { Option } = Select;

export const CoachTeamPage: React.FC = () => {
  // Get filters from localStorage or use defaults
  const getInitialFilter = (key: string) => {
    const saved = localStorage.getItem(`coachTeam_${key}`);
    return saved || "all";
  };

  const [selectedEvent, setSelectedEvent] = useState(getInitialFilter('event'));
  const [selectedSport, setSelectedSport] = useState(getInitialFilter('sport'));

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('coachTeam_event', selectedEvent);
    localStorage.setItem('coachTeam_sport', selectedSport);
  }, [selectedEvent, selectedSport]);

  const {
    Info,
    loading,
    isModalVisible,
    isEditMode,
    form,
    isLoading,
    fileList,
    previewImage,
    handleFileChange,
    handleAddPlayerTeam,
    handleUpdatePlayer,
    handleDeletePlayerTeam,
    showAddPlayerModal,
    showEditPlayerModal,
    onModalClose,
    selectedPlayer
  } = useCoach();

  // Create memoized lists of unique events and sports
  const filterOptions = useMemo(() => {
    if (!Info?.handledEvents) return {
      eventOptions: [{ value: 'all', label: 'All Events' }],
      sportOptions: [{ value: 'all', label: 'All Sports' }]
    };

    const availableEvents = [...new Set(Info.handledEvents.map((event: any) => 
      event.eventDetails?.eventName))].filter(Boolean);
    
    // Filter sports based on selected event
    const availableSports = [...new Set(Info.handledEvents
      .filter((event: any) => selectedEvent === 'all' || event.eventDetails?.eventName === selectedEvent)
      .map((event: any) => event.sportDetails?.sportsName))].filter(Boolean);

    return {
      eventOptions: [
        { value: 'all', label: 'All Events' },
        ...availableEvents.map(eventName => ({
          value: eventName,
          label: eventName
        }))
      ],
      sportOptions: [
        { value: 'all', label: 'All Sports' },
        ...availableSports.map(sportName => ({
          value: sportName,
          label: sportName
        }))
      ]
    };
  }, [Info, selectedEvent]);

  // Filter events based on selection
  const filteredEvents = useMemo(() => {
    if (!Info?.handledEvents) return [];
    let filtered = Info.handledEvents;

    if (selectedEvent !== 'all') {
      filtered = filtered.filter((event: any) => 
        event.eventDetails?.eventName === selectedEvent);
    }

    if (selectedSport !== 'all') {
      filtered = filtered.filter((event: any) => 
        event.sportDetails?.sportsName === selectedSport);
    }

    return filtered;
  }, [Info, selectedEvent, selectedSport]);

  const handleEventChange = (value: string) => {
    setSelectedEvent(value);
    if (value === 'all') {
      setSelectedSport('all');
    }
  };

  const handleSportChange = (value: string) => {
    setSelectedSport(value);
  };

  const columns = [
    {
      title: "Player Name",
      dataIndex: "playerName",
      key: "playerName",
    },
    {
      title: "Medical Certificate",
      dataIndex: "medicalCertificate",
      key: "medicalCertificate",
      render: (text: string) =>
        text ? (
          <Image
            src={text}
            alt="Medical Certificate"
            width={50}
            height={50}
            style={{ objectFit: "cover" }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span className={`${
          status === 'approved' ? 'text-green-600' :
          status === 'rejected' ? 'text-red-600' :
          'text-yellow-600'
        } font-semibold`}>
          {status?.charAt(0).toUpperCase() + status?.slice(1)}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_text: any, record: any) => (
        <div className="flex gap-4">
          <Tooltip title="Edit player details">
            <EditOutlined
              onClick={() => showEditPlayerModal(record)}
              className="text-xl text-blue-500 hover:text-blue-600 cursor-pointer transition-colors"
            />
          </Tooltip>
          <Popconfirm
            title="Delete Player"
            description="Are you sure you want to delete this player?"
            onConfirm={() => handleDeletePlayerTeam(record.playerId)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ 
              className: "bg-red-500 hover:bg-red-600"
            }}
          >
            <Tooltip title="Delete player">
              <DeleteOutlined 
                className="text-xl text-red-500 hover:text-red-600 cursor-pointer transition-colors"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!Info || !Info.handledEvents || Info.handledEvents.length === 0) {
    return <p>No events or players found.</p>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Coach Team Management</Title>

      {/* Filters */}
      <div className="flex justify-center gap-4 mb-6">
        <Select
          value={selectedEvent}
          onChange={handleEventChange}
          style={{ width: 200 }}
          placeholder="Filter by Event"
          className="rounded-full"
        >
          {filterOptions.eventOptions.map((option: any) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>

        <Select
          value={selectedSport}
          onChange={handleSportChange}
          style={{ width: 200 }}
          placeholder="Filter by Sport"
          className="rounded-full"
          disabled={selectedEvent === 'all'}
        >
          {filterOptions.sportOptions.map((option: any) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>

      {filteredEvents.map((event: any) => (
        <Card
          key={event.sportEventsId}
          title={`${event.team?.teamName || "No Team"} - ${
            event.sportDetails?.sportsName || "No Sport"
          }`}
          style={{ marginBottom: "16px" }}
          extra={
            <Button
              type="primary" 
              icon={<PlusOutlined />} 
              style={{ backgroundColor: '#064518', marginBottom: 0 }}
              onClick={() => showAddPlayerModal(event.teamEvent.teamEventId)}
            >
              Add Player
            </Button>
          }
        >
          <p>
            <strong>Event:</strong>{" "}
            {event.eventDetails?.eventName || "No Event"}
          </p>
          <p>
            <strong>Sport:</strong>{" "}
            {event.sportDetails?.sportsName || "No Sport"}
          </p>
          <Table
            dataSource={event.players || []}
            columns={columns}
            rowKey="playerId"
            pagination={false}
          />
        </Card>
      ))}

      {/* Add/Edit Player Modal */}
      <Modal
        title={isEditMode ? "Edit Player" : "Add Player"}
        open={isModalVisible}
        onCancel={onModalClose}
        onClose={onModalClose}
        footer={null}
      >
        <Form 
          form={form} 
          onFinish={isEditMode ? handleUpdatePlayer : handleAddPlayerTeam} 
          layout="vertical"
          initialValues={isEditMode ? {
            playerName: selectedPlayer?.playerName,
            medicalCertificate: selectedPlayer?.medicalCertificate ? [{
              uid: '-1',
              name: 'medical-certificate',
              status: 'done',
              url: selectedPlayer.medicalCertificate,
            }] : []
          } : undefined}
        >
          <Form.Item
            name="playerName"
            label="Player Name"
            rules={[
              { required: true, message: "Please enter the player's name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="medicalCertificate"
            label="Medical Certificate"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[
              {
                required: !isEditMode,
                message: "Please upload the medical certificate",
              },
            ]}
          >
            <Dragger
              name="file"
              multiple={false}
              maxCount={1}
              beforeUpload={() => false}
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              fileList={fileList}
            >
              {previewImage ? (
                <div style={{ textAlign: "center" }}>
                  <Image src={previewImage} alt="Medical Certificate" />
                </div>
              ) : (
                <div>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for a single upload. Only .pdf, .jpg, .jpeg, and
                    .png files are allowed.
                  </p>
                </div>
              )}
            </Dragger>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              loading={isLoading}
              htmlType="submit"
              className="w-full"
            >
              {isEditMode ? "Update Player" : "Add Player"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
