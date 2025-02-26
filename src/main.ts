import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { OpenAI } from 'openai';
import { decrypt } from "@/utils/crypto";
import type { ChatCompletionCreateParamsBase, ChatCompletionChunk } from 'openai/resources/chat/completions.mjs';
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

let apiKey = localStorage.getItem('apiKey');
apiKey = apiKey !== null ? decrypt(apiKey) : "";

const openai = new OpenAI(
  {
    apiKey,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    dangerouslyAllowBrowser: true
  }
);
// const main = async () => {
//   let reasoningContent = '';
//   let answerContent = '';
//   let isAnswering = false;
//   try {
//     const stream = await openai.chat.completions.create({
//       model: 'deepseek-r1',
//       messages:[{role:'user',content:'123456'}],
//       stream: true
//     });
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }
app.config.globalProperties.$getChatCompletion = async (messages: ChatCompletionCreateParamsBase['messages']) => {
  let reasoningContent = '';
  let answerContent = '';
  let isAnswering = false;
  if ((apiKey ?? '') === '') {
    throw '请输入apiKey'
  } else {
    try {
      const stream = await openai.chat.completions.create({
        model: 'deepseek-r1',
        messages,
        stream: true
      });
      for await (const chunk of stream) {
        if (!chunk.choices?.length) {
          console.log('\nUsage:');
          console.log(chunk.usage);
          continue;
        }

        const delta: any = chunk.choices[0].delta;

        // 处理思考过程
        if (delta.reasoning_content) {
          reasoningContent += delta.reasoning_content;
        }
        // 处理正式回复
        else if (delta.content) {
          if (!isAnswering) {
            isAnswering = true;
          }
          answerContent += delta.content;
        }
        return delta;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      console.error('Error:', error);
    }
  }
}
app.use(createPinia())
app.use(router)
app.use(ElementPlus, { size: 'default' })
app.mount('#app')
