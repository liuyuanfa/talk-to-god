import { defineStore } from "pinia";

export const useUserListStore = defineStore({
  id: "userList",
  state: () => ({
    userList: [
      { name: "用户1" },
      { name: "用户2" },
      { name: "用户3" },
      { name: "用户1" },
      { name: "用户2" },
      { name: "用户3" },
      { name: "用户1" },
      { name: "用户2" },
      { name: "用户3" },
    ],
    currentUser: {
      name: "",
    },
  }),
  getters: {
    userSum: (state) => state.userList.length,
    userNames: (state) => {
      return state.userList.map((v) => v.name);
    },
  },
  actions: {
    setUserList(userList) {
      this.userList = userList;
    },
    setCurrentUser(user) {
      this.currentUser = user;
    },
  },
});
