/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Table, Button, Modal, Popconfirm, Image, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { Team } from "../../../types";
import useTeamsHooks from "./useTeamsHooks";
import TeamsForm from "./form";
import { MdOutlineInfo } from "react-icons/md";
import { dateStringFormatter } from "../../../utility/utils";
import { PlusOutlined } from "@ant-design/icons";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export const TeamsPage: React.FC = () => {
  const {
    handleAddOrEditTeam,
    showModal,
    handleDeleteTeam,
    setIsModalVisible,
    setIsImageUpdated,
    isModalVisible,
    isFetchingTeams,
    teams = [], // Default to an empty array to avoid undefined or null
    editingTeam,
    form,
    coaches,
    loading,
  } = useTeamsHooks();

  const navigate = useNavigate();

  const columns = [
    {
      title: "Team Logo",
      dataIndex: "teamLogo",
      key: "teamLogo",
      render: (teamLogo: string | undefined) => (
        <Image
          width={50}
          height={50}
          src={teamLogo}
          alt="Team Logo"
          className="rounded-full border border-gray-300"
        />
      ),
    },
    {
      title: "Team Name",
      dataIndex: "teamName",
      key: "teamName",
      render: (teamName: string) => (
        <span className="text-gray-800 font-semibold">{teamName}</span>
      ),
    },
    {
      title: "Team Coach",
      dataIndex: "coachName",
      key: "coachName",
      render: (coachName: string) => (
        <span className="text-gray-800 font-semibold">{coachName}</span>
      ),
    },
    {
      title: "Date Added",
      dataIndex: "dateAdded",
      key: "dateAdded",
      render: (v: string) => (
        <span className="text-gray-600">{dateStringFormatter(v)}</span>
      ),
    },
    {
      title: "Added by",
      dataIndex: "addedByName",
      key: "addedByName",
      render: (coachName: string) => (
        <span className="text-gray-800 font-semibold">{coachName}</span>
      ),
    },
    {
      title: "Updated by",
      dataIndex: "updatedByName",
      key: "updatedByName",
      render: (coachName: string) => (
        <span className="text-gray-800 font-semibold">{coachName}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Team) => (
        <div className="flex space-x-3">
          <Tooltip title="Edit Team">
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-500" />}
              onClick={() => showModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Team">
            <Popconfirm
              title="Are you sure you want to delete this team?"
              onConfirm={() => handleDeleteTeam(record.teamId)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                icon={<DeleteOutlined className="text-red-500" />}
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="View Info">
            <Button
              type="text"
              icon={<MdOutlineInfo className="text-green-500" />}
              onClick={() => navigate(`/Teams/${record.teamId}`)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Teams Management</h1>
        <Button
          type="primary"
          onClick={() => showModal()}
          style={{ backgroundColor: '#064518', marginBottom: 16 }}
          icon={<PlusOutlined />}
        >
          Add Team
        </Button>
      </div>

      {/* Ensure teams is an array */}
      <Table
        columns={columns}
        dataSource={Array.isArray(teams) ? teams : []}
        rowKey="teamId"
        loading={isFetchingTeams}
        className="shadow-lg rounded-lg overflow-hidden"
        bordered
        locale={{
          emptyText: isFetchingTeams ? "Loading teams..." : "No teams available",
        }}
        pagination={{
          pageSize: 10,
          position: ["bottomRight"],
          showSizeChanger: false,
          className: "rounded-full",
          showTotal: (total) => `Total ${total} teams`,
          style: { marginRight: '16px' }
        }}
        style={{ 
          border: '1px solid #d9d9d9',
        }}
      />

      {isModalVisible && (
        <Modal
          title={editingTeam ? "Edit Team" : "Add Team"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <TeamsForm
            form={form}
            loading={loading}
            setIsImageUpdated={setIsImageUpdated}
            handleAddOrEditTeam={handleAddOrEditTeam}
            editingTeam={editingTeam}
            coaches={coaches}
          />
        </Modal>
      )}
    </div>
  );
};
