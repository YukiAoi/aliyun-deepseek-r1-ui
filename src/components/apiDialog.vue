<template>
  <el-dialog
    v-model="props.apiDialog"
    title="请输入apiKey"
    width="500"
    top="35vh"
  >
    <el-form
      ref="refRuleForm"
      :model="data.ruleForm"
      :rules="data.rules"
      class="demo-ruleForm"
    >
      <el-form-item label="apiKey" prop="apiKey">
        <el-input
          label-suffix="："
          v-model="data.ruleForm.apiKey"
          placeholder="请输入apiKey"
          type="password"
          clearable
          show-password
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="methods.cancel(refRuleForm)">取消</el-button>
        <el-button type="primary" @click="methods.confirm(refRuleForm)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { encrypt, decrypt } from "@/utils/crypto";
import type { FormInstance, FormRules } from "element-plus";
const refRuleForm = ref<FormInstance>();
const props = defineProps<{
  apiDialog: boolean;
}>();
interface ruleForm {
  apiKey: string;
}
interface Data {
  apiDialog: boolean;
  ruleForm: ruleForm;
  rules: FormRules<ruleForm>;
}
const data = reactive<Data>({
  apiDialog: false,
  ruleForm: {
    apiKey: "",
  },
  rules: {
    apiKey: [{ required: true, message: "请输入apiKey", trigger: "blur" }],
  },
});
watch(
  () => props.apiDialog,
  (val) => {
    if (val) {
      let apiKey = localStorage.getItem("apiKey");
      data.ruleForm.apiKey = apiKey !== null ? decrypt(apiKey) : "";
    }
  }
);
const methods = {
  cancel(refRuleForm: FormInstance | undefined) {
    if (!refRuleForm) {
      return;
    }
    refRuleForm.resetFields();
  },
  confirm(refRuleForm: FormInstance | undefined) {
    if (!refRuleForm) {
      return;
    }
    refRuleForm.validate((valid) => {
      if (valid) {
        localStorage.setItem("apiKey", encrypt(data.ruleForm.apiKey));
      }
    });
  },
};
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>