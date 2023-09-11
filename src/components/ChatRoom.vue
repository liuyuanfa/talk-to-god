<template>
  <div class="room">
    <h2 style="text-align: center">{{ roomStore.currentRoom?.name }}</h2>
    <div class="list" id="list">
      <div
        class="list-detail"
        :class="{
          'list-detail-right': item.username === currentUser?.name,
        }"
        v-for="(item, index) in msgList"
        :key="index"
      >
        <div class="list-detail-name">
          <span v-show="item.username !== currentUser?.name">
            {{ item.username }}
          </span>
          <span class="message-time">{{ item.time }}</span>
          <span v-show="item.username === currentUser?.name">
            {{ item.username }}
          </span>
        </div>
        <div class="list-detail-content">{{ item.message }}</div>
      </div>
    </div>
  </div>
  <div class="message">
    <a-textarea
      class="message-input"
      v-model:value="messageText"
      placeholder="在这里输入消息，Enter键发送"
      :rows="4"
      @pressEnter="sendData"
      :bordered="false"
    />
    <div class="message-button">
      <a-button class="message-button" type="primary" @click="sendData"
        >发送</a-button
      >
    </div>
  </div>
</template>
<script setup>
import { nextTick, ref, onBeforeMount, watch } from "vue";
import { message } from "ant-design-vue";
import { useRoomListStore } from "@/store/roomList";
import { useUserListStore } from "@/store/userList";

const roomStore = useRoomListStore();
const currentUser = useUserListStore().currentUser;
// 消息列表
const msgList = ref([
  { username: "123", message: "hjk", time: "123141" },
  { username: "45123", message: "hjk", time: "123141" },
]);
const messageText = ref("");
const environment = process.env.VUE_APP_API_URL;
let msg_socket;

onBeforeMount(() => {
  // 消息websocket
  msg_socket = new WebSocket(`ws://${environment}/msg/info`);
  msg_socket.onmessage = function (event) {
    const message = JSON.parse(event.data);
    console.log("【聊天】WebSocket 接受消息:", message);
    msgList.value.push(message);
    nextTick(() => {
      const listDom = document.getElementById("list");
      listDom.scrollTop = listDom.scrollHeight;
    });
  };

  // 监听连接事件
  msg_socket.onopen = function () {
    console.log("【聊天】WebSocket 连接已建立");
  };

  // 监听错误事件
  msg_socket.onerror = function (event) {
    console.log("【聊天】WebSocket 出错: ", event);
  };

  // 监听关闭事件
  msg_socket.onclose = function () {
    console.log("【聊天】WebSocket 连接已关闭");
  };
});

// 发送消息
const sendData = () => {
  messageText.value = messageText.value.trim();
  if (!messageText.value) {
    messageText.value = null;
    message.warning("请勿发送空消息！");
    return;
  }
  if (messageText.value) {
    msg_socket.send(messageText.value);
    setTimeout(() => {
      messageText.value = null;
    });
    console.log("【聊天】WebSocket 发送消息:", messageText.value);
  }
};

watch(
  () => roomStore.currentRoom,
  (newVal) => {
    if (newVal) {
      msgList.value = [];
    }
  }
);
</script>
<style scoped lang="less">
.room {
  height: 60%;
  display: flex;
  flex-direction: column;
  .list {
    flex: 1;
    height: 60%;
    overflow-y: auto;
    padding: 0 16px;
    &-detail {
      margin-bottom: 12px;
      &:hover {
        .message-time {
          visibility: inherit;
        }
      }
      &-name {
        display: flex;
        align-items: center;
        color: gray;
        margin-bottom: 4px;
        font-size: 12px;
        gap: 8px;
        .message-time {
          visibility: hidden;
        }
      }
      &-content {
        position: relative;
        background-color: #f2f2f2;
        border-radius: 8px;
        padding: 10px;
        max-width: 40%;
        display: inline-block;
        &:before {
          content: "";
          position: absolute;
          top: 50%;
          left: -13px;
          transform: translateY(-50%);
          border-width: 7px;
          border-style: solid;
          border-color: transparent #f2f2f2 transparent transparent;
        }
      }
    }
    .list-detail-right {
      text-align: right;
      .list-detail-name {
        justify-content: end;
      }
      .list-detail-content::before {
        right: -13px;
        left: unset;
        border-color: transparent transparent transparent #f2f2f2;
      }
    }
  }
}
.message {
  flex: 1;
  padding: 4px 10px 10px 0;
  border-top: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  &-input {
    flex: 1;
    resize: none;
  }
  &-button {
    height: fit-content;
    text-align: right;
  }
}
</style>
