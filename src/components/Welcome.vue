<template>
  <div class="welcome">
    <h2>欢迎来到Talk To God聊天室</h2>
    <a-button class="join-btn" type="primary" @click="joinChat"
      >加入聊天</a-button
    >
  </div>
  <a-modal
    v-model:open="showDialog"
    width="50%"
    title="用户名"
    :closable="false"
    @cancel="cancel"
  >
    <a-input
      autofocus
      placeholder="请输入用户名"
      v-model:value="username"
      @pressEnter="confirm"
    ></a-input>
    <template #footer>
      <a-button type="primary" @click="confirm">确定</a-button>
    </template>
  </a-modal>
</template>
<script setup>
import { ref } from "vue";
import { useUserListStore } from "@/store/userList";
import { message } from "ant-design-vue";

const emits = defineEmits(["join"]);
const showDialog = ref(false);
const username = ref("");
const userStore = useUserListStore();

const joinChat = () => {
  showDialog.value = true;
};

const confirm = () => {
  if (userStore.userNames.includes(username.value)) {
    message.warning("用户名重复，请修改");
    return;
  }
  emits("join", username.value);
  close();
};

const close = () => {
  showDialog.value = false;
  username.value = "";
};

const cancel = () => {
  username.value = "";
};
defineExpose({ close });
</script>
<style lang="less" scoped>
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
</style>
