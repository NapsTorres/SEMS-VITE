/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Modal, DatePicker, Input, Typography, Form } from "antd";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import moment from "moment";

interface ScheduleModalProps {
  isModalVisible: boolean;
  schedule: string | null;
  setSchedule: (date: string) => void;
  venue: string;
  setVenue: (venue: string) => void;
  handleScheduleSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isModalVisible,
  schedule,
  setSchedule,
  venue,
  setVenue,
  handleScheduleSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(() => {
      handleScheduleSubmit();
    });
  };

  return (
    <Modal
      title={<span className="text-xl font-semibold">📅 Set Match Schedule</span>}
      open={isModalVisible}
      onOk={handleSubmit}
      onCancel={onCancel}
      centered
      okText="Save Schedule"
      cancelText="Cancel"
      confirmLoading={isSubmitting}
      okButtonProps={{ 
        type: "primary", 
        shape: "round",
        disabled: !schedule || !venue
      }}
      cancelButtonProps={{ shape: "round" }}
      bodyStyle={{ padding: "20px" }}
      style={{ maxWidth: "400px" }}
    >
      <Form form={form} layout="vertical">
        <Typography.Text type="secondary" className="block mb-4">
          Please set both the schedule and venue for the match.
        </Typography.Text>
        
        <Form.Item
          name="schedule"
          label="Match Schedule"
          rules={[{ required: true, message: 'Please select a schedule' }]}
        >
          <DatePicker
            showTime={{ use12Hours: true, format: "hh:mm A" }}
            format="YYYY-MM-DD HH:mm:ss"
            className="w-full border rounded-lg shadow-sm"
            placeholder="Select Date and Time"
            suffixIcon={<CalendarOutlined />}
            value={schedule ? moment(schedule) : null}
            onChange={(date) => setSchedule(date ? date.format('YYYY-MM-DD HH:mm:ss') : '')}
            disabledDate={(current) => current && current < moment().startOf('day')}
          />
        </Form.Item>

        <Form.Item
          name="venue"
          label="Match Venue"
          rules={[{ required: true, message: 'Please enter a venue' }]}
        >
          <Input
            placeholder="Enter venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            prefix={<EnvironmentOutlined />}
            className="rounded-lg"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ScheduleModal;
