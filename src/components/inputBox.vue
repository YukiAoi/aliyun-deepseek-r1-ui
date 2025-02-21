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
        <el-button
          @click="methods.changeStatus('isDeep')"
          :type="data.isDeep ? 'primary' : ''"
        >
          深度思考
        </el-button>
        <el-button
          @click="methods.changeStatus('isOnline')"
          :type="data.isOnline ? 'primary' : ''"
        >
          联网搜索
        </el-button>
      </div>
      <div></div>
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