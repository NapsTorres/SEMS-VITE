/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../../axios";
import Api from "../../endpoints/list";

const GamesServices = {
  gameSchedule: async () => await axiosInstance.get(Api.GAMES().LIST),
  scoreIncrement: async (data:any) => await axiosInstance.post(Api.GAMES().INCREMENT,data),
  gameStatus: async (data:any) => await axiosInstance.post(Api.GAMES().STATUS,data),
  gameMatchId: async (matchId:any) => await axiosInstance.get(`${Api.GAMES().ID}/${matchId}`),
  updateSchedule: async (data: { matchId: string; schedule: string; venue: string }) => 
    await axiosInstance.post(Api.EVENTS().SETSCHEDULE, data),
};

export default GamesServices;
