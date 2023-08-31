<template>
  <div class="main">
    <div class="sidebar">
      <h2 style="text-align: center">在线用户({{ userSum }})</h2>

      <div class="user" v-for="(item, index) in userList" :key="index">
        用户{{ index + 1 }}:{{ item.name }}
      </div>
    </div>
    <div class="container">
      <template v-if="!isLogin">
        <div class="welcome">
          <h2>欢迎来到Talk To God聊天室</h2>
          <a-button class="join-btn" type="primary" @click="joinChat"
            >加入聊天</a-button
          >
        </div>
      </template>
      <template v-else>
        <div class="room">
          <h2 style="text-align: center">匿名群聊室</h2>
          <div class="list" id="list">
            <div
              class="list-detail"
              :class="{
                'list-detail-right': item.username === currentUser.name,
              }"
              v-for="(item, index) in msgList"
              :key="index"
            >
              <div class="list-detail-name">
                <span v-show="item.username !== currentUser.name">
                  {{ item.username }}
                </span>
                <span class="message-time">{{ item.time }}</span>
                <span v-show="item.username === currentUser.name">
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
            placeholder="在这里输入消息"
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
    </div>
  </div>
  <div class="dialog-overlay" v-if="showDialog">
    <div id="dialogBox" class="dialog-box">
      <div class="dialog-header">用户名</div>
      <div class="dialog-content">
        <a-input
          autofocus
          placeholder="请输入用户名"
          v-model:value="currentUser.name"
          @pressEnter="confirm"
        ></a-input>
      </div>
      <div class="dialog-footer">
        <a-button type="primary" @click="confirm">确认</a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref } from "vue";
import { message } from "ant-design-vue";

const userList = ref([]);
const msgList = ref([
  { username: "123", message: "hjk", time: "123141" },
  { username: "45123", message: "hjk", time: "123141" },
]);
const userSum = ref(0);
const messageText = ref("");
const environment = process.env.VUE_APP_API_URL;
const isLogin = ref(false);
const showDialog = ref(false);
const currentUser = ref({
  name: "",
});
console.log("环境", process.env, environment);

// 用户websocket
// const user_socket = new WebSocket("ws://192.168.51.28:1234/conn/info");
// var user_socket = new WebSocket("ws://42.192.51.50:1234/conn/info");
const user_socket = new WebSocket(`ws://${environment}/conn/info`);
user_socket.onmessage = function (event) {
  const message = JSON.parse(event.data);
  console.log("【用户信息】WebSocket 接受消息:", message);
  userSum.value = message.counter;
  const user = { name: message.username };
  userList.value = Array(userSum.value).fill(user);
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

// 消息websocket
const msg_socket = new WebSocket(`ws://${environment}/msg/info`);
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

const joinChat = () => {
  showDialog.value = true;
};

const confirm = () => {
  showDialog.value = false;
  isLogin.value = true;
};

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
</script>
<style scoped lang="less">
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 5px;
}

.main {
  display: flex;
  height: 100%;
  .sidebar {
    width: 20%;
    padding: 8px;
    border-right: 1px solid #f0f0f0;
    overflow-y: auto;
    .user {
      margin-bottom: 5px;
      padding: 4px;
    }
  }
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    .welcome {
      display: flex;
      height: 100%;
      flex-direction: column;
      gap: 30px;
      align-items: center;
      justify-content: center;
      .join-btn {
        width: 180px;
        height: 60px;
        font-size: 23px;
        font-weight: 500;
      }
    }
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
  }
}
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-box {
  background-color: #fff;
  width: 300px;
  border-radius: 5px;
}
.dialog-header {
  padding: 13px 20px;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid #f0f0f0;
}
.dialog-content {
  padding: 20px;
}
.dialog-footer {
  text-align: right;
  padding: 0 20px 10px 20px;
}
</style>
