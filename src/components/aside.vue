<template>
  <div class="up-aside">
    <div class="title">
      <span>alicloud-ds-R1</span>
      <span class="click-type icon-click">
        <el-icon style="color: #606266" :size="16">
          <DArrowLeft />
        </el-icon>
      </span>
    </div>
    <div class="chat-title">
      <span>对话</span>
      <span class="click-type icon-click" style="width: 20px; height: 20px">
        <el-icon style="color: rgba(0, 0, 0, 0.6)" :size="12">
          <Delete />
        </el-icon>
      </span>
    </div>
    <ul
      v-for="item in data.chatList"
      :key="item.fldGuid"
      class="click-type"
      @click="methods.getChat(item)"
    >
      {{
        item.fldName
      }}
    </ul>
  </div>
  <div class="down-aside">
    <ul class="click-type" @click="methods.addChat">
      <el-icon style="color: rgba(0, 0, 0, 0.6)" :size="14">
        <CirclePlusFilled />
      </el-icon>
      <span style="margin-left: 12px">新增对话</span>
    </ul>
    <ul class="click-type" @click="methods.setting">
      <el-icon style="color: rgba(0, 0, 0, 0.6)" :size="14">
        <Tools />
      </el-icon>
      <span style="margin-left: 12px">设置</span>
    </ul>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["setting", "getChat"]);
import { onMounted, reactive } from "vue";
interface ChatMessage {
  fldGuid: string;
  fldName: string;
}
interface Data {
  chatList: ChatMessage[];
}

const data = reactive<Data>({
  chatList: [],
});
const methods = {
  addChat() {
    data.chatList.push({
      fldGuid: methods.newGuid(),
      fldName: "新对话",
    });
  },
  newGuid() {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  },
  setting() {
    emit("setting");
  },
  getChat(item: ChatMessage) {
    emit("getChat", item);
  },
};
onMounted(() => {
  if (data.chatList.length <= 0) {
    methods.addChat();
    methods.getChat(data.chatList[0]);
  }
});
</script>

<style scoped lang="scss">
.title {
  font-size: 20px;
  font-weight: 600;
  color: #606266;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.chat-title {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.up-aside {
  height: calc(100% - 193px);
  border-bottom: 1px solid #dcdfe6;
  padding: 16px;
}
.down-aside {
  height: 128px;
  padding: 16px;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  height: 32px;
  display: flex;
  align-items: center;
  font-size: 14px;
}
</style>
