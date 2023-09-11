<template>
  <div class="list-title">
    <span>在线用户</span>
    <span style="color: #dcdcdc">{{ userList?.length || 0 }}</span>
  </div>
  <div class="user-list">
    <div
      class="user-list_user"
      v-for="(item, index) in userList"
      :key="index"
      @dblclick="createChat(item)"
    >
      <img class="avatar" :src="item?.sex === 1 ? girlIcon : boyIcon" />
      <span class="common-overflow">{{ item.name }}</span>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import boyIcon from "../assets/image/boy.svg";
import girlIcon from "../assets/image/girl.svg";
import { useUserListStore } from "@/store/userList";

const emits = defineEmits(["createChat"]);
const userStore = useUserListStore();
const userList = userStore.userList;
const environment = process.env.VUE_APP_API_URL;
console.log("环境", process.env, environment);
let user_socket;

onBeforeMount(() => {
  // 用户websocket
  //  user_socket = new WebSocket("ws://192.168.51.28:1234/conn/info");
  //  user_socket = new WebSocket("ws://42.192.51.50:1234/conn/info");
  user_socket = new WebSocket(`ws://${environment}/conn/info`);
  user_socket.onmessage = function (event) {
    const message = JSON.parse(event.data);
    console.log("【用户信息】WebSocket 接受消息:", message);
    const user = { name: message.username };
    // TODO: 用户列表数据待处理
    // userList.value = Array(userSum.value).fill(user);
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

const createChat = (user) => {
  userStore.setCurrentUser(user);
  emits("createChat", user);
};
</script>
<style lang="less" scoped>
.list-title {
  font-size: 12px;
  padding: 8px;
  display: flex;
  justify-content: space-between;
}
.user-list {
  user-select: none;
  flex: 1;
  overflow-y: auto;
  &_user {
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
}
</style>
