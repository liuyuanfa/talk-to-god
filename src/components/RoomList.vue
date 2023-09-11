<template>
  <div class="list-title">
    <span>消息列表</span>
    <span style="color: #dcdcdc">{{ roomList?.length || 0 }}</span>
  </div>
  <div class="room-list">
    <div
      class="room-list_room"
      :class="{ selected: roomStore.currentRoom.name === item.name }"
      v-for="(item, index) in roomList"
      @click="selectRoom(item)"
      :key="index"
    >
      <img class="avatar" :src="chatIcon" />
      <span class="common-overflow">{{ item.name }}</span>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import chatIcon from "../assets/image/chat.svg";
import { useRoomListStore } from "@/store/roomList";

const roomStore = useRoomListStore();
const roomList = roomStore.roomList;
const selectedRoom = roomStore.currentRoom;
const environment = process.env.VUE_APP_API_URL;
let user_socket;

onMounted(() => {
  selectRoom(roomList[0]);
  // TODO: 修改成聊天室socket，待后端
  user_socket = new WebSocket(`ws://${environment}/conn/info`);
  user_socket.onmessage = function (event) {
    const message = JSON.parse(event.data);
    console.log("【用户信息】WebSocket 接受消息:", message);
    // TODO: 用户列表数据待处理
    // roomList.value = Array(userSum.value).fill(user);
  };

  // 监听连接事件
  user_socket.onopen = function () {
    console.log("【用户信息】WebSocket 连接已建立");
  };

  // 监听错误事件
  user_socket.onerror = function (event) {
    console.log("【用户信息】WebSocket 出错: ", event);
  };

  // 监听关闭事件
  user_socket.onclose = function () {
    console.log("【用户信息】WebSocket 连接已关闭");
  };
});

const selectRoom = (room) => {
  roomStore.setCurrentRoom(room);
  // roomStore.currentRoom = room;
  console.log("select", selectedRoom, roomStore.currentRoom);
};

const create = (user) => {
  roomStore.addRoom({ name: user.name });
};

defineExpose({ create });
</script>
<style lang="less" scoped>
.list-title {
  font-size: 12px;
  padding: 8px;
  display: flex;
  justify-content: space-between;
}
.room-list {
  flex: 1;
  overflow-y: auto;
  user-select: none;
  &_room {
    border-bottom: 1px solid #f0f0f0;
    padding: 8px;
    display: flex;
    align-items: center;
    cursor: pointer;

    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 6px;
    }
  }
  .selected {
    background-color: #cac8c6;
  }
}
</style>
