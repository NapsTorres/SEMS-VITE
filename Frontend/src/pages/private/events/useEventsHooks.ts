/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form } from "antd";
import { useFetchData } from "../../../config/axios/requestData";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useEventsRequest from "../../../config/data/events";
import EventsServices from "../../../config/service/events";
import { Events } from "../../../types";
import dayjs from "dayjs";
import useStore from "../../../zustand/store/store";
import { selector } from "../../../zustand/store/store.provider";

export default function useEventsHooks() {
  const queryClient = useQueryClient(); 
  const admin = useStore(selector('admin'))
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEvents, setEditingEvents] = useState<Events | null>(null);
  const [form] = Form.useForm();
  const { isLoading, addEventsMutation, deleteEventsMutation, editEventsMutation } =
    useEventsRequest({
      setIsModalVisible,
    });

  const { data: rawEvents, isLoading: isFetchingEvents } = useFetchData(
    ["Events"],
    [
      () => EventsServices.fetchEvents(),
    ]
  );

  // Debug logging
  if (rawEvents && rawEvents.length > 0) {
    console.log('First event raw data:', rawEvents[0]);
    console.log('Available properties:', Object.keys(rawEvents[0]));
  }

  // Process the events to ensure dates are in the correct format
  const Events = rawEvents?.map((event: any) => {
    return {
      ...event,
      eventstartDate: event.eventStartDate,
      eventendDate: event.eventEndDate
    };
  });

  const handleAddOrEditEvent = (values: Events) => {
    const formData = new FormData();
    formData.append("eventName", values.eventName);
    formData.append("description", values.description);
    formData.append("eventYear", new Date().getFullYear().toString());
    formData.append("eventstartDate", values.eventstartDate || '');
    formData.append("eventendDate", values.eventendDate || '');
    if(editingEvents){
        formData.append("eventId", editingEvents.eventId.toString());
        formData.append("updatedBy", admin.info.id.toString());
    } else {
      formData.append("createdBy", admin.info.id.toString());
    }
    const mutation = editingEvents ? editEventsMutation : addEventsMutation;
    mutation(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["Events"] })
        form.resetFields()
      },                
    });
  };

  const handleDeleteEvents = (eventId: any) => {
    deleteEventsMutation(eventId, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Events"] }),
    });
  };

  const showModal = (team: Events | null = null) => {
    setEditingEvents(team);
    if (team) {
      const formValues = {
        ...team,
        eventendDate: dayjs(team.eventendDate),
        eventstartDate: dayjs(team.eventstartDate)
      };
      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const loading = isLoading || isFetchingEvents;
  return {
    Events,
    isModalVisible,
    editingEvents,
    form,
    loading,
    handleAddOrEditEvent,
    setIsModalVisible,
    handleDeleteEvents,
    showModal,
  };
}
