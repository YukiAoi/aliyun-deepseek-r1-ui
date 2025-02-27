<template>
  <el-dialog v-model="apiDialog" title="请输入apiKey" width="500" top="35vh">
    <el-form ref="refRuleForm" :model="data.ruleForm" :rules="data.rules">
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
import { ElMessage } from "element-plus";
const refRuleForm = ref<FormInstance>();
let apiDialog = defineModel("apiDialog", {
  type: Boolean,
  default: false,
});
interface ruleForm {
  apiKey: string;
}
interface Data {
  ruleForm: ruleForm;
  rules: FormRules<ruleForm>;
}
const emit = defineEmits(["getApiKey"]);
const data = reactive<Data>({
  ruleForm: {
    apiKey: "",
  },
  rules: {
    apiKey: [{ required: true, message: "请输入apiKey", trigger: "blur" }],
  },
});
watch(
  () => apiDialog.value,
  (val) => {
    if (val) {
      let apiKey = localStorage.getItem("apiKey");
      if (apiKey !== null && apiKey !== "") {
        data.ruleForm.apiKey = decrypt(apiKey);
      } else {
        data.ruleForm.apiKey = "";
      }
    }
  }
);
const methods = {
  cancel(refRuleForm: FormInstance | undefined) {
    if (!refRuleForm) {
      return;
    }
    refRuleForm.resetFields();
    apiDialog.value = false;
    emit("getApiKey", data.ruleForm.apiKey);
  },
  confirm(refRuleForm: FormInstance | undefined) {
    if (!refRuleForm) {
      return;
    }
    refRuleForm.validate((valid) => {
      if (valid) {
        localStorage.setItem("apiKey", encrypt(data.ruleForm.apiKey));
        ElMessage.success("修改apiKey成功");
        methods.cancel(refRuleForm);
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