/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient } from '@tanstack/react-query';
import { useFetchData } from '../../config/axios/requestData';
import useTeamsRequest from '../../config/data/teams';
import UserServices from '../../config/service/users';
import useStore from '../../zustand/store/store';
import { selector } from '../../zustand/store/store.provider';
import { useState } from 'react';
import { Form } from 'antd';

export default function useCoach() {
  const coach = useStore(selector('admin'));
  const coachId = coach.info?.id;
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentSportEventId, setCurrentSportEventId] = useState<number | null>(null);

  const { data: Info, isPending } = useFetchData<any>(
    ['coach',],
    [() => UserServices.fetchCoach(coachId)]
  );

  const { addPlayerMutation, deletePlayerMutation, updatePlayerMutation, isLoading } = useTeamsRequest({});

  const showAddPlayerModal = (sportEventId: number) => {
    setIsEditMode(false);
    setSelectedPlayer(null);
    setCurrentSportEventId(sportEventId);
    setIsModalVisible(true);
    form.resetFields();
    setFileList([]);
    setPreviewImage(null);
  };

  const showEditPlayerModal = (player: any) => {
    setIsEditMode(true);
    setSelectedPlayer(player);
    setIsModalVisible(true);
    form.setFieldsValue({
      playerName: player.playerName,
      medicalCertificate: player.medicalCertificate ? [{ url: player.medicalCertificate, name: 'Current Certificate' }] : []
    });
    if (player.medicalCertificate) {
      setPreviewImage(player.medicalCertificate);
      setFileList([{ url: player.medicalCertificate, name: 'Current Certificate', uid: '-1' }]);
    }
  };

  const handleFileChange = (info: any) => {
    if (info.fileList.length === 0) {
      setFileList([]);
      setPreviewImage(null);
      return;
    }
    
    const updatedFileList = info.fileList.slice(-1); 
    setFileList(updatedFileList);
    
    // If it's a new file, generate preview
    if (updatedFileList[0]?.originFileObj) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(updatedFileList[0].originFileObj);
    }
  };

  const handleAddPlayerTeam = async(values:any) =>{
    if (!currentSportEventId) return;
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
        const value = values[key as keyof typeof values];
        if (key === "medicalCertificate" && value?.length > 0) {
          formData.append(key, value[0]?.originFileObj);
        } else {
          formData.append(key, value !== null ? String(value) : "");
        }
      });
    formData.append('teamEventId',currentSportEventId?.toString())
    addPlayerMutation(formData, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coach"] });
            setIsModalVisible(false)
            setFileList([])
            setPreviewImage(null)
            form.resetFields()
        },
      });
  }

  const handleUpdatePlayer = async(values:any) =>{
    if (!selectedPlayer) return;
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
        const value = values[key as keyof typeof values];
        if (key === "medicalCertificate") {
          // Only append if there's a new file
          if (value?.length > 0 && value[0]?.originFileObj) {
            formData.append(key, value[0]?.originFileObj);
          }
        } else {
          formData.append(key, value !== null ? String(value) : "");
        }
      });
    formData.append('playerId', selectedPlayer.playerId.toString());
    updatePlayerMutation(formData, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coach"] });
            setIsModalVisible(false)
            setFileList([])
            setPreviewImage(null)
            form.resetFields()
            setSelectedPlayer(null);
            setIsEditMode(false);
        },
      });
  }

  const handleDeletePlayerTeam = async(playerId:any) =>{
    if (!playerId) return;
    deletePlayerMutation(playerId, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coach"] }),
      });
  }

  const onModalClose = () =>{
    setIsModalVisible(false)
    setFileList([])
    setPreviewImage(null)
    form.resetFields()
    setSelectedPlayer(null);
    setIsEditMode(false);
  }

  return {
    Info:Info?.length > 0 ? Info[0] : {},
    loading: isPending,
    isLoading,
    currentSportEventId,
    isModalVisible,
    isEditMode,
    selectedPlayer,
    form,
    fileList,
    previewImage,
    setCurrentSportEventId,
    handleAddPlayerTeam,
    handleUpdatePlayer,
    showAddPlayerModal,
    showEditPlayerModal,
    setIsModalVisible,
    handleDeletePlayerTeam,
    handleFileChange,
    onModalClose
  };
}
