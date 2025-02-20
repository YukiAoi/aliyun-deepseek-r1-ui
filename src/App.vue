<template>
  <el-container class="all">
    <el-aside>
      <uiAside @setting="methods.setting" @getChat="methods.getChat"></uiAside>
    </el-aside>
    <el-container>
      <el-header>
        <div
          v-show="!data.titleEdit"
          style="max-width: 100px; overflow: hidden; margin-right: 10px"
        >
          {{ data.chatTitle }}
        </div>
        <el-input
          v-show="data.titleEdit"
          style="max-width: 100px; margin-right: 10px"
          v-model="data.chatTitle"
          @blur="methods.confirm"
        ></el-input>
        <span
          class="click-type icon-click"
          style="width: 20px; height: 20px"
          @click="methods.setChatTitle"
          v-show="!data.titleEdit"
        >
          <el-icon style="color: rgba(0, 0, 0, 0.6)" :size="14">
            <EditPen />
          </el-icon>
        </span>
      </el-header>
      <el-container>
        <el-main>Main</el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
  <apiDialog :apiDialog="data.apiDialog"></apiDialog>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { RouterLink, RouterView } from "vue-router";
import uiAside from "./components/aside.vue";
import apiDialog from "./components/apiDialog.vue";

const emit = defineEmits(["setChatTitle"]);

interface Data {
  apiDialog: boolean;
  chat: ChatMessage;
  chatTitle: string;
  titleEdit: boolean;
}
interface ChatMessage {
  fldGuid: string;
  fldName: string;
}

const data = reactive<Data>({
  apiDialog: false,
  chat: {
    fldName: "",
    fldGuid: "",
  },
  chatTitle: "",
  titleEdit: false,
});

const methods = {
  setting() {
    data.apiDialog = true;
  },
  getChat(chat: ChatMessage) {
    data.chatTitle = chat.fldName;
    data.chat = chat;
  },
  setChatTitle() {
    data.titleEdit = true;
  },
  confirm() {
    emit("setChatTitle", {
      fldGuid: data.chat.fldGuid,
      fldName: data.chatTitle,
    });
  },
};
</script>

<style scoped>
.el-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
}
.el-aside {
  width: 240px;
  border-right: 1px solid #dcdfe6;
}
.all,
.el-aside,
.is-vertical {
  height: 100%;
}
.el-footer {
  border-top: 1px solid #dcdfe6;
  height: 120px;
}
</style>
