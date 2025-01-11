/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Modal, DatePicker, Input, Typography, Form } from "antd";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from 'dayjs';

interface ScheduleModalProps {
  isModalVisible: boolean;
  schedule: string | null;
  setSchedule: (date: string) => void;
  venue: string;
  setVenue: (venue: string) => void;
  handleScheduleSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  eventStartDate?: string;
  eventEndDate?: string;
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
  eventStartDate,
  eventEndDate,
}) => {
  const [form] = Form.useForm();

  // Reset form when modal becomes visible
  React.useEffect(() => {
    if (isModalVisible) {
      form.setFieldsValue({
        schedule: schedule ? dayjs(schedule) : null,
        venue: venue
      });
    }
  }, [isModalVisible, schedule, venue, form]);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      onCancel(); // Close the modal first
      handleScheduleSubmit(); // Then handle the submission
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const disabledDate = (current: Dayjs) => {
    // Always prevent past dates
    if (current && current.isBefore(dayjs().startOf('day'))) {
      return true;
    }

    // If event dates are set, restrict to those dates
    if (eventStartDate && eventEndDate) {
      const start = dayjs(eventStartDate).startOf('day');
      const end = dayjs(eventEndDate).endOf('day');
      return current.isBefore(start) || current.isAfter(end);
    }

    // If no event dates are set, only prevent past dates
    return false;
  };

  return (
    <Modal
      title={<span className="text-xl font-semibold">📅 Set Match Schedule</span>}
      open={isModalVisible}
      onOk={handleSubmit}
      onCancel={handleCancel}
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
          {eventStartDate && eventEndDate && (
            <span className="block mt-1 text-xs">
              Note: Schedule must be between {dayjs(eventStartDate).format('MMMM DD, YYYY')} and {dayjs(eventEndDate).format('MMMM DD, YYYY')}
            </span>
          )}
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
            value={schedule ? dayjs(schedule) : null}
            onChange={(date) => setSchedule(date ? date.format('YYYY-MM-DD HH:mm:ss') : '')}
            disabledDate={disabledDate}
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
