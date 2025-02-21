<template>
  <div
    v-for="(item, index) in props.messageList"
    :key="index"
    style="display: flex; margin-bottom: 20px"
    :style="{ justifyContent: item.person === 'customer' ? 'end' : 'start' }"
  >
    <div v-if="item.person === 'customer'" class="customer-message">
      {{ item.content }}
    </div>
    <div v-else :id="`fldRemarkHtml${index}`"></div>
  </div>
</template>
<script lang="ts" setup>
import { watch } from "vue";

interface MessageList {
  content: string;
  person: string;
}
const props = defineProps<{
  messageList: MessageList[];
}>();
watch(
  () => props.messageList,
  (val) => {
    val.forEach((item, index) => {
      if (item.person === "server") {
        let fldRemarkHtml = document.getElementById(`fldRemarkHtml${index}`);
        if (fldRemarkHtml) {
          fldRemarkHtml.innerHTML = item.content;
        }
        // fldRemarkHtml.innerHTML = item.content;
      }
    });
  }
);
</script>

<style lang="scss" scoped>
.customer-message {
  max-width: 520px;
  background: hsla(0, 0%, 91%, 0.5);
  padding: 10px;
  white-space: break-spaces;
  border-radius: 4px;
  display: flex;
  justify-content: end;
}
</style>
