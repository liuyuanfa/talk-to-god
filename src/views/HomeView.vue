<template>
  <div class="main">
    <div class="sidebar">
      <div class="list">
        <UserList v-if="showUserList" @createChat="createChat"></UserList>
        <RoomList v-if="!showUserList" ref="roomListRef"></RoomList>
      </div>
      <div class="toggle-button" v-if="isLogin" @click="toggleList">
        <RetweetOutlined style="color: gray" />
        <span>{{ showUserList ? "切换消息列表" : "查看在线用户" }}</span>
      </div>
    </div>
    <div class="container">
      <Welcome v-if="!isLogin" @join="handleJoin"></Welcome>
      <ChatRoom v-else></ChatRoom>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref } from "vue";
import { RetweetOutlined } from "@ant-design/icons-vue";
import Welcome from "@/components/Welcome.vue";
import ChatRoom from "@/components/ChatRoom.vue";
import UserList from "@/components/UserList.vue";
import RoomList from "@/components/RoomList.vue";
import { message } from "ant-design-vue";

const isLogin = ref(false);
const showUserList = ref(true);
const roomListRef = ref();

// 用户加入默认群聊
const handleJoin = (name) => {
  // TODO: 加入用户接口
  isLogin.value = true;
  showUserList.value = false;
};

const toggleList = () => {
  showUserList.value = !showUserList.value;
};

const createChat = (user) => {
  if (!isLogin.value) {
    message.warning("请先加入聊天");
    return;
  }
  showUserList.value = false;
  nextTick(() => {
    if (roomListRef.value) {
      roomListRef.value.create(user);
    }
  });
};
</script>
<style scoped lang="less">
.main {
  display: flex;
  height: 100%;
  .sidebar {
    width: 200px;
    border-right: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
    .list {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }
    .toggle-button {
      height: 35px;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      & > span {
        margin-left: 6px;
        color: gray;
      }
    }
  }
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
