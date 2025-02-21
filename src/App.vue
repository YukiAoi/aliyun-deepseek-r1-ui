<template>
  <el-container class="all">
    <el-aside :width="data.isHide ? '60px' : '240px'">
      <uiAside
        @setting="methods.setting"
        @getChat="methods.getChat"
        @changeHide="methods.changeHide"
      ></uiAside>
    </el-aside>
    <el-container>
      <el-header>
        <div
          v-show="!data.titleEdit"
          style="max-width: 200px; overflow: hidden; margin-right: 10px"
        >
          {{ data.chatTitle }}
        </div>
        <el-input
          v-show="data.titleEdit"
          style="max-width: 200px; margin-right: 10px"
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
        <el-main>
          <chatBox :messageList="data.chat.messageList"></chatBox>
        </el-main>
        <el-footer>
          <inputBox @send="methods.send"></inputBox>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
  <apiDialog :apiDialog="data.apiDialog"></apiDialog>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import uiAside from "./components/aside.vue";
import apiDialog from "./components/apiDialog.vue";
import inputBox from "./components/inputBox.vue";
import chatBox from "./components/chatBox.vue";

const emit = defineEmits(["setChatTitle"]);

interface Data {
  apiDialog: boolean;
  chat: ChatMessage;
  chatTitle: string;
  titleEdit: boolean;
  isHide: boolean;
}
interface MessageList {
  content: string;
  person: string;
}
interface ChatMessage {
  fldGuid: string;
  fldName: string;
  messageList: MessageList[];
}

const data = reactive<Data>({
  isHide: false,
  apiDialog: false,
  chat: {
    fldName: "",
    fldGuid: "",
    messageList: [],
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
    data.titleEdit = false;
    if ((data.chatTitle ?? "") === "") {
      data.chatTitle = "新对话";
    }
    emit("setChatTitle", {
      fldGuid: data.chat.fldGuid,
      fldName: data.chatTitle,
    });
  },
  changeHide(isHide: boolean) {
    data.isHide = isHide;
  },
  send(content: string) {
    data.chat.messageList.push({
      content,
      person: "customer",
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
  border-right: 1px solid #dcdfe6;
}
.all,
.el-aside,
.is-vertical {
  height: 100%;
}
.el-footer {
  border-top: 1px solid #dcdfe6;
  height: 200px;
  padding: 0;
}
</style>
