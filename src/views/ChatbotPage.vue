<template>
  <div class="chatbot-container">
    <div class="chat-messages" ref="chatContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.type]"
      >
        <div class="message-content">
          {{ message.text }}
        </div>
      </div>
    </div>
    <div class="input-container">
      <BaseInput
        v-model="userInput"
        placeholder="메시지를 입력하세요..."
        @keyup.enter="sendMessage"
      />
      <BaseButton @click="sendMessage" :disabled="!userInput.trim()">
        전송
      </BaseButton>
    </div>
  </div>
</template>

<script>
import BaseInput from "@/components/atoms/BaseInput.vue";
import BaseButton from "@/components/atoms/BaseButton.vue";
import openAIAPI from "@/api/openai";

export default {
  name: "ChatbotPage",
  components: {
    BaseInput,
    BaseButton,
  },
  data() {
    return {
      messages: [],
      userInput: "",
      isLoading: false,
    };
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim()) return;

      // 사용자 메시지 추가
      this.messages.push({
        type: "user",
        text: this.userInput.trim(),
      });

      const userMessage = this.userInput.trim();
      this.userInput = "";
      this.isLoading = true;

      try {
        // OpenAI API 호출
        const response = await this.callOpenAI(userMessage);

        // 챗봇 응답 추가
        this.messages.push({
          type: "bot",
          text: response,
        });

        console.log("채팅 결과 : ", response);
      } catch (error) {
        console.error("OpenAI API 오류:", error);
        this.messages.push({
          type: "bot",
          text: "죄송합니다. 오류가 발생했습니다.",
        });
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    scrollToBottom() {
      const container = this.$refs.chatContainer;
      container.scrollTop = container.scrollHeight;
    },
    async callOpenAI(message) {
      try {
        return await openAIAPI.chat(message);
      } catch (error) {
        console.error("OpenAI API 호출 오류:", error);
        throw error;
      }
    },
  },
};
</script>

<style scoped>
.chatbot-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f6f7;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  margin: 4px 0;
}

.message.user {
  align-self: flex-end;
  background-color: #03c75a;
  color: white;
}

.message.bot {
  align-self: flex-start;
  background-color: white;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-container {
  padding: 20px;
  background-color: white;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

.input-container :deep(.base-input) {
  flex: 1;
}
</style>
