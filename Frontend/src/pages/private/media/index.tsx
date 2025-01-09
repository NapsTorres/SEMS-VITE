/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button, Modal, Upload, Select, Form, Typography, message, Input, Spin } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import useMediaHooks from "./useMedia";
import SwiperCarousel from "../../../components/swiper";

const { Option } = Select;
const { Dragger } = Upload;
const { Title, Text } = Typography;

export const MediaPage: React.FC = () => {
  const {
    Medias,
    isModalVisible,
    form,
    loading,
    isFetchingMedia,
    handleUploadMedia,
    setIsModalVisible,
    handleDeleteMedia,
  } = useMediaHooks();

  const [previewUrl, setPreviewUrl] = useState("");
  const [previewType, setPreviewType] = useState<"image" | "video">("image");

  const handleFormSubmit = (values: any) => {
    handleUploadMedia(values);
  };

  const handlePreview = (file: any) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (isImage || isVideo) {
      setPreviewType(isImage ? "image" : "video");
      setPreviewUrl(URL.createObjectURL(file.originFileObj || file));
    }
  };

  const onDeleteMedia = async (mediaId: number) => {
    try {
      await handleDeleteMedia(mediaId);
    } catch (error) {
      message.error("Failed to delete media. Please try again.");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-center items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Media Gallery</h1>
      </div>

      <div className="flex justify-center my-8">
        <Button
          type="primary"
          icon={<UploadOutlined />}
          size="large"
          onClick={() => setIsModalVisible(true)}
          style={{ backgroundColor: '#064518', borderColor: '#064518', color: 'white' }}
        >
          Upload Media
        </Button>
      </div>

      <div className="mb-12">
        <Title level={3} className="text-gray-800 mb-4">
          Images
        </Title>
        {isFetchingMedia ? (
          <div className="flex justify-center">
            <Spin />
          </div>
        ) : Medias && Medias.length > 0 ? (
          <SwiperCarousel
            items={Medias.filter(
              (media: { type: string }) => media.type === "image"
            ).map((media:any) => ({
              media: media.url,
              buttonText: "DELETE", 
              type: media.type,
              title: media.title, 
              description: media.description, 
              author: media.author, 
              mediaId: media.mediaId, 
            }))}
            onButtonClick={onDeleteMedia} 
          />
        ) : (
          <Text>No images uploaded yet.</Text>
        )}
      </div>

      <div>
        <Title level={3} className="text-gray-800 mb-4">
          Videos
        </Title>
        {isFetchingMedia ? (
          <div className="flex justify-center">
            <Spin />
          </div>
        ) : Medias && Medias.length > 0 ? (
          <SwiperCarousel
            items={Medias.filter(
              (media: { type: string }) => media.type === "video"
            ).map((media: any) => ({
              media: media.url,
              buttonText: "DELETE", 
              type: media.type,
              mediaId: media.mediaId, 
              title: media.title, 
              description: media.description, 
              author: media.author, 
            }))}
            onButtonClick={onDeleteMedia} 
          />
        ) : (
          <Text>No videos uploaded yet.</Text>
        )}
      </div>

      <Modal
        title="Upload Media"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setPreviewUrl(""); 
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Form.Item
            label="Select Media Type"
            name="type"
            rules={[{ required: true, message: "Please select a media type." }]}
          >
            <Select placeholder="Select Media Type">
              <Option value="image">Image</Option>
              <Option value="video">Video</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title." }]}
          >
            <Input placeholder="Enter title" />
          </Form.Item>

          <Form.Item
            label="Description (Optional)"
            name="description"
          >
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            label="Author (Optional)"
            name="author"
          >
            <Input placeholder="Enter author name" />
          </Form.Item>

          <Form.Item
            label="Upload Media"
            name="media"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: true, message: "Please upload a file." }]}
          >
            <Dragger
              beforeUpload={(file) => {
                handlePreview(file);
                return false; 
              }}
              multiple={false}
              maxCount={1}
            >
              {previewUrl ? (
                <div className="p-4 bg-gray-100 rounded-lg">
                  {previewType === "image" ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      controls
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    ></video>
                  )}
                </div>
              ) : (
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Drag & drop your file here, or click to browse.
                  </p>
                </>
              )}
            </Dragger>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ backgroundColor: '#064518', borderColor: '#064518', color: 'white' }}
            >
              Upload
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MediaPage;
