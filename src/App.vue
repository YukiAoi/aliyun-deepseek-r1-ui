<template>
  <el-container class="all">
    <el-aside :width="data.isHide ? '60px' : '240px'">
      <uiAside
        @setting="methods.setting"
        @getChat="methods.getChat"
        @changeHide="methods.changeHide"
        ref="asideRef"
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
  <apiDialogVue
    v-model:apiDialog="apiDialog"
    @getApiKey="methods.getApiKey"
  ></apiDialogVue>
</template>
<script setup lang="ts">
import { ElMessage } from "element-plus";
import { reactive, getCurrentInstance, ref, onMounted } from "vue";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { decrypt } from "@/utils/crypto";
import uiAside from "./components/aside.vue";
import apiDialogVue from "./components/apiDialog.vue";
import inputBox from "./components/inputBox.vue";
import chatBox from "./components/chatBox.vue";

const emit = defineEmits(["setChatTitle"]);
const asideRef = ref<any>();

interface Data {
  chat: ChatMessage;
  chatTitle: string;
  titleEdit: boolean;
  isHide: boolean;
  apiKey: string;
}
interface MessageList {
  content: string;
  think: string;
  person: string;
  answer: string;
}
interface ChatMessage {
  fldGuid: string;
  fldName: string;
  messageList: MessageList[];
}

let apiDialog = ref<boolean>(false);

const data = reactive<Data>({
  isHide: false,
  chat: {
    fldName: "",
    fldGuid: "",
    messageList: [],
  },
  chatTitle: "",
  titleEdit: false,
  apiKey: "",
});
onMounted(() => {
  let apiKey = localStorage.getItem("apiKey");
  if (apiKey !== null && apiKey !== "") {
    data.apiKey = decrypt(apiKey);
  } else {
    data.apiKey = "";
  }
  console.log(data.apiKey, "apiKey");
  console.log(
    JSON.parse(
      `{"choices":[{"delta":{"content":"。","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1740638113,"system_fingerprint":null,"model":"deepseek-r1","id":"chatcmpl-663ae37c-6afa-9e1e-b7b4-0a1a5ff26edd"}`
    )
  );
});
const methods = {
  setting() {
    apiDialog.value = true;
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
  getApiKey(apiKey: string) {
    data.apiKey = apiKey;
  },
  async send(content: string) {
    data.chat.messageList.push({
      content,
      person: "customer",
      think: "",
      answer: "",
    });
    const index = data.chat.messageList.length - 1;
    await fetchEventSource(
      "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-r1",
          messages: [
            {
              content,
              role: "user",
            },
          ],
          stream: true,
        }),
        onmessage(event) {
          console.log("接收到事件:", event.data, typeof event.data);
          if (event.data !== "[DONE]" && (event.data ?? "") !== "") {
            let eventData = JSON.parse(event.data);
            if (eventData?.choices && eventData?.choices.length > 0) {
              if (eventData.choices[0].finish_reason !== "stop") {
                if ((eventData.choices[0].content ?? "") !== "") {
                  data.chat.messageList[index].answer +=
                    eventData.choices[0].content;
                }
                if ((eventData?.choices[0].reasoning_content ?? "") !== "") {
                  data.chat.messageList[index].think +=
                    eventData.reasoning_content[0].content;
                }
              }
            }
            if (eventData.id !== data.chat.fldGuid) {
              data.chat.fldGuid = eventData.id;
            }
          }
          if (event.data === "[DONE]") {
            asideRef.value.methods.setInLocal();
          }
        },
        onerror(error) {
          ElMessage.error(error.toString());
          throw error;
        },
        onclose() {},
      }
    );
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
