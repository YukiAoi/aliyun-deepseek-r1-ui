<template>
  <div class="up-aside" v-show="!data.isHide">
    <div class="title">
      <span>alicloud-ds-R1</span>
      <span class="click-type icon-click" @click="methods.changeHide(true)">
        <el-icon style="color: #606266" :size="16">
          <DArrowLeft />
        </el-icon>
      </span>
    </div>
    <div class="chat-title">
      <span>对话</span>
      <span
        class="click-type icon-click"
        style="width: 20px; height: 20px"
        @click="methods.deleteList"
      >
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
  <div class="down-aside" v-show="!data.isHide">
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
  <div class="hide-aside" v-show="data.isHide">
    <span class="click-type icon-click" @click="methods.changeHide(false)">
      <el-icon style="color: #606266" :size="16">
        <DArrowRight />
      </el-icon>
    </span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
const emit = defineEmits(["setting", "getChat", "changeHide"]);
interface ChatMessage {
  fldGuid: string;
  fldName: string;
}
interface Data {
  chatList: ChatMessage[];
  isHide: boolean;
}

const data = reactive<Data>({
  chatList: [],
  isHide: false,
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
  changeHide(isHide: boolean) {
    data.isHide = isHide;
    emit("changeHide", isHide);
  },
  deleteList() {
    ElMessageBox.confirm("确认清空对话记录？", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      data.chatList = [];
      ElMessage({
        type: "success",
        message: "删除成功",
      });
    });
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
}
.down-aside {
  height: 128px;
}
.hide-aside {
  height: calc(100% - 32px);
  display: flex;
  justify-content: center;
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
.hide-aside,
.up-aside,
.down-aside {
  padding: 16px;
}
</style>
