<template>
  <div :class="['chatbot-container', theme]">
    <div class="theme-toggle">
      <div class="toggle-wrapper" @click="toggleTheme">
        <div :class="['toggle-button', theme]">
          <i :class="['fas', theme === 'light' ? 'fa-moon' : 'fa-sun']"></i>
        </div>
      </div>
    </div>

    <div class="chat-layout">
      <div class="main-chat">
        <div class="chat-messages" ref="chatContainer">
          <div
            v-for="(message, index) in visibleMessages"
            :key="index"
            :class="['message', message.type]"
          >
            <div class="message-content">
              {{ message.content }}
            </div>
          </div>
          <div v-if="isLoading" class="message bot loading">
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        <div class="input-container">
          <BaseInput
            class="chat-input"
            v-model="userInput"
            placeholder="메시지를 입력하세요..."
            @keyup.enter="sendMessage"
          />
          <BaseButton
            @click="sendMessage"
            :disabled="!userInput.trim()"
            class="send-button"
          >
            전송
          </BaseButton>
        </div>
      </div>

      <div class="chat-list-toggle" @click="toggleChatList">
        <i
          :class="['fas', isListOpen ? 'fa-chevron-right' : 'fa-chevron-left']"
        ></i>
      </div>

      <transition name="slide">
        <div v-if="isListOpen" class="chat-list">
          <h2>대화 목록</h2>
          <div class="chat-items">
            <div
              v-for="(chat, index) in chatList"
              :key="index"
              :class="['chat-item', { active: currentChatId === chat.id }]"
              @click="selectChat(chat.id)"
            >
              <div class="chat-item-title">{{ chat.title }}</div>
              <div class="chat-item-preview">{{ chat.preview }}</div>
            </div>
          </div>
          <BaseButton class="new-chat-btn" @click="handleNewChat">
            <i class="fas fa-plus"></i> 새 대화
          </BaseButton>
        </div>
      </transition>
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
      visibleMessages: [],
      userInput: "",
      isLoading: false,
      isListOpen: false,
      theme: "light",
      chatList: [],
      currentChatId: null,
    };
  },
  watch: {
    messages: {
      handler() {
        // 메시지 최적화 처리
        this.optimizeMessages();

        // 스크롤 최하단으로 이동
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      deep: true,
    },
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim()) return;

      const userMessage = this.userInput.trim();
      this.userInput = "";

      // 사용자 메시지 객체 생성
      const userMessageObj = {
        type: "user",
        content: userMessage,
        role: "user",
      };

      // 메시지 배열에 사용자 메시지 추가
      this.messages = [...this.messages, userMessageObj];

      // 현재 대화가 없으면 새로 생성 (메시지 추가 후에 실행)
      if (!this.currentChatId) {
        // userMessageObj를 포함한 메시지가 있는 상태로 새 대화 생성
        this.createNewChat(this.messages);
      }

      this.isLoading = true;

      try {
        // 이전 대화 내역 구성
        const previousMessages = this.messages
          .filter((msg) => msg.role && msg.content)
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

        // OpenAI API 호출
        const response = await this.callOpenAI(userMessage, previousMessages);

        // 챗봇 응답 객체 생성
        const botMessageObj = {
          type: "bot",
          content: response,
          role: "assistant",
        };

        // 메시지 배열에 챗봇 응답 추가
        this.messages = [...this.messages, botMessageObj];

        // 현재 대화의 미리보기 업데이트
        this.updateChatPreview(this.currentChatId, userMessage);

        // 대화가 충분히 진행되었고 (2개 이상의 메시지) 제목이 "새 대화"인 경우에만 제목 생성
        const currentChat = this.chatList.find(
          (chat) => chat.id === this.currentChatId
        );
        if (
          currentChat &&
          currentChat.title === "새 대화" &&
          this.messages.length >= 2
        ) {
          this.generateChatTitle();
        }
      } catch (error) {
        console.error("OpenAI API 오류:", error);
        // 에러 메시지 추가
        this.messages = [
          ...this.messages,
          {
            type: "bot",
            content: "죄송합니다. 오류가 발생했습니다.",
            role: "assistant",
          },
        ];
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    scrollToBottom() {
      const container = this.$refs.chatContainer;
      if (container) {
        // 부드러운 스크롤 효과 적용
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    },
    // 메시지 수가 많을 때 최적화 (선택적으로 적용)
    optimizeMessages() {
      // 메시지가 너무 많을 경우 (예: 100개 초과) 최근 메시지만 화면에 표시
      const MAX_VISIBLE_MESSAGES = 50;
      if (this.messages.length > MAX_VISIBLE_MESSAGES) {
        // API 호출용 전체 메시지는 유지
        // 화면에 표시할 메시지는 최근 N개로 제한
        this.visibleMessages = this.messages.slice(-MAX_VISIBLE_MESSAGES);
      } else {
        this.visibleMessages = [...this.messages];
      }
    },
    async callOpenAI(message, previousMessages) {
      try {
        return await openAIAPI.chat(message, previousMessages);
      } catch (error) {
        console.error("OpenAI API 호출 오류:", error);
        throw error;
      }
    },
    toggleChatList() {
      this.isListOpen = !this.isListOpen;
    },
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
    },
    createNewChat(initialMessages = []) {
      // 새 대화 객체 생성
      const newChat = {
        id: Date.now(),
        title: "새 대화",
        preview: "새로운 대화를 시작하세요",
        messages: [...initialMessages], // 초기 메시지가 있으면 그대로 유지
      };

      // 채팅 목록 맨 앞에 새 대화 추가
      this.chatList.unshift(newChat);

      // 현재 대화 ID 업데이트
      this.currentChatId = newChat.id;

      // messages 배열은 변경하지 않음 (initialMessages가 이미 있으면 그대로 유지)
    },
    selectChat(chatId) {
      // 현재 대화의 메시지들을 저장
      if (this.currentChatId) {
        const currentChat = this.chatList.find(
          (chat) => chat.id === this.currentChatId
        );
        if (currentChat) {
          currentChat.messages = [...this.messages];
        }
      }

      // 선택한 대화의 메시지들을 불러오기
      this.currentChatId = chatId;
      const selectedChat = this.chatList.find((chat) => chat.id === chatId);
      if (selectedChat) {
        this.messages = [...selectedChat.messages];
      }
    },
    updateChatPreview(chatId, message) {
      const chat = this.chatList.find((c) => c.id === chatId);
      if (chat) {
        // 미리보기 업데이트
        chat.preview = message;
        // 현재 대화의 메시지 배열 업데이트
        chat.messages = [...this.messages];
      }
    },
    handleNewChat() {
      // 현재 대화의 메시지들을 저장
      if (this.currentChatId) {
        const currentChat = this.chatList.find(
          (chat) => chat.id === this.currentChatId
        );
        if (currentChat) {
          currentChat.messages = [...this.messages];
        }
      }

      // 빈 메시지 배열로 새 대화 생성
      this.createNewChat([]);

      // 메시지 배열 초기화 (새 대화 시작)
      this.messages = [];
    },
    async generateChatTitle() {
      try {
        // 현재 채팅이 없으면 리턴
        if (!this.currentChatId) return;

        // 메시지가 충분하지 않으면 리턴
        if (this.messages.length < 2) return;

        // 대화 주제 생성 API 호출
        const title = await openAIAPI.generateChatTitle(this.messages);

        // 제목이 생성되었으면 대화방 제목 업데이트
        if (title && title !== "새 대화") {
          const chat = this.chatList.find((c) => c.id === this.currentChatId);
          if (chat) {
            chat.title = title;
          }
        }
      } catch (error) {
        console.error("대화 주제 생성 오류:", error);
        // 오류 발생 시 기본 제목 유지
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
  background-color: var(--bg-color);
  color: var(--text-color);
  overflow: hidden; /* 컨테이너 전체의 스크롤을 방지 */
}

.chat-input {
  width: 94%;
  background-color: var(--input-bg);
  color: var(--input-text);
  border: 1px solid var(--border-color);
}

.chat-input::placeholder {
  color: var(--text-color);
  opacity: 0.5;
}

.chatbot-container.light {
  --bg-color: #f5f6f7;
  --text-color: #333;
  --chat-bg: white;
  --border-color: #eee;
  --button-bg: #03c75a;
  --button-text: white;
  --input-bg: white;
  --input-text: #333;
  --chat-list-bg: white;
  --chat-item-hover: rgba(3, 199, 90, 0.1);
  --chat-item-active: rgba(3, 199, 90, 0.2);
  --placeholder-color: #999;
}

.chatbot-container.dark {
  --bg-color: #1a1a1a;
  --text-color: #fff;
  --chat-bg: #2d2d2d;
  --border-color: #404040;
  --button-bg: #2c5282; /* 어두운 블루 색상 */
  --button-text: white;
  --input-bg: #333;
  --input-text: white;
  --chat-list-bg: #2d2d2d;
  --chat-item-hover: rgba(44, 82, 130, 0.3); /* 어두운 블루 색상 */
  --chat-item-active: rgba(44, 82, 130, 0.5); /* 어두운 블루 색상 */
  --placeholder-color: #aaa;
}

.chat-layout {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden; /* 레이아웃 전체의 스크롤을 방지 */
}

.main-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 메인 채팅 영역의 스크롤을 방지 */
}

.chat-messages {
  flex: 1;
  overflow-y: auto; /* 메시지 영역에만 세로 스크롤 허용 */
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
  word-break: break-word; /* 긴 단어도 적절히 줄바꿈 */
}

.message.user {
  align-self: flex-end;
  background-color: var(--button-bg);
  color: var(--button-text);
}

.message.bot {
  align-self: flex-start;
  background-color: var(--chat-bg);
  color: var(--text-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-container {
  padding: 20px;
  background-color: var(--chat-bg);
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 10px;
  z-index: 2; /* 스크롤 내용 위에 항상 표시되도록 */
  position: relative; /* z-index가 적용되도록 */
}

.chat-list {
  width: 300px;
  background-color: var(--chat-list-bg);
  border-left: 1px solid var(--border-color);
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 대화 리스트 컨테이너의 스크롤을 방지 */
}

.chat-items {
  flex: 1;
  overflow-y: auto; /* 대화 아이템 리스트에만 세로 스크롤 허용 */
}

.chat-item {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chat-item:hover {
  background-color: var(--chat-item-hover);
}

.chat-item.active {
  background-color: var(--chat-item-active);
}

.chat-item-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.chat-item-preview {
  font-size: 0.9em;
  color: var(--text-color);
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.new-chat-btn {
  margin-top: 16px;
  background-color: var(--button-bg);
  color: var(--button-text);
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.chat-list-toggle {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background-color: var(--chat-bg);
  border: 1px solid var(--border-color);
  border-right: none;
  border-radius: 4px 0 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
}

.theme-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
}

.toggle-wrapper {
  width: 60px;
  height: 30px;
  background-color: var(--border-color);
  border-radius: 15px;
  position: relative;
  cursor: pointer;
}

.toggle-button {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-button.light {
  left: 2px;
  background-color: #fff;
  color: #ffd700;
}

.toggle-button.dark {
  right: 2px;
  background-color: #2c5282; /* 어두운 블루 색상으로 변경 */
  color: #fff;
}

/* 슬라이드 애니메이션 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 8px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background-color: #03c75a;
  border-radius: 50%;
  animation: typing 1s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.send-button {
  background-color: var(--button-bg);
  color: var(--button-text);
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
