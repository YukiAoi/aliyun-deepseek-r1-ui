<template>
  <div style="padding: 10px; height: calc(100% - 20px)">
    <el-input
      type="textarea"
      v-model="data.content"
      placeholder="给deepseek发送信息"
      :rows="6"
      resize="none"
    ></el-input>
    <div class="other-box">
      <div>
        <el-tooltip
          effect="dark"
          content="调用新模型R1，解决推理问题"
          placement="left"
        >
          <el-button
            @click="methods.changeStatus('isDeep')"
            :type="data.isDeep ? 'primary' : ''"
            icon="Opportunity"
          >
            深度思考
          </el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="按需搜索网页" placement="right">
          <el-button
            @click="methods.changeStatus('isOnline')"
            :type="data.isOnline ? 'primary' : ''"
            icon="Search"
          >
            联网搜索
          </el-button>
        </el-tooltip>
      </div>
      <div>
        <el-tooltip
          effect="dark"
          :content="
            data.isOnline ? '联网搜索不支持上传文件' : '上传附件（仅识别文字）'
          "
          placement="top"
        >
          <el-button circle :disabled="data.isOnline">
            <el-icon :size="20"><Paperclip /></el-icon>
          </el-button>
        </el-tooltip>
        <el-button type="primary" circle :disabled="data.content === ''">
          <el-icon :size="20"><Top /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
interface Data {
  [key: string]: string | boolean;
  // content: string;
  // isDeep: boolean;
  // isOnline: boolean;
}
const data = reactive<Data>({
  content: "",
  isDeep: false,
  isOnline: false,
});

const methods = {
  changeStatus(prop: string) {
    data[prop] = !data[prop];
  },
};
</script>

<style lang="scss" scoped>
.other-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
::v-deep .el-textarea__inner {
  box-shadow: none;
}
::v-deep .el-radio-button__inner {
  border-left: var(--el-border) !important;
  border-radius: var(--el-border-radius-base) !important;
}
</style>