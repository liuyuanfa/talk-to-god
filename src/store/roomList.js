import { defineStore } from "pinia";

export const useRoomListStore = defineStore({
  id: "roomList",
  state: () => {
    return {
      roomList: [
        { name: "匿名聊天室" },
        { name: "匿名聊天室2" },
        { name: "匿名聊天室3" },
      ],
      currentRoom: {
        name: "",
      },
    };
  },
  getters: {
    getCurRoom: (state) => state.currentRoom,
  },
  actions: {
    setRoomList(roomList) {
      this.roomList = roomList;
    },
    setCurrentRoom(room) {
      this.currentRoom = room;
    },
    addRoom(room) {
      this.roomList.push(room);
      this.currentRoom = room;
    },
  },
});
