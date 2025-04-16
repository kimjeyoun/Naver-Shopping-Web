<template>
  <div :class="['chatbot-container', theme]">
    <div class="back-button" @click="goBack">
      <i class="fas fa-arrow-left"></i>
    </div>
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
          <ChatMessage
            v-for="(message, index) in visibleMessages"
            :key="index"
            :type="message.type"
            :content="message.content"
          />
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
        <ChatInput :theme="theme" @send="sendMessage" />
      </div>

      <div class="chat-list-toggle" @click="toggleChatList">
        <i
          :class="['fas', isListOpen ? 'fa-chevron-right' : 'fa-chevron-left']"
        ></i>
      </div>

      <ChatList
        :is-open="isListOpen"
        :chat-list="chatList"
        :current-chat-id="currentChatId"
        :theme="theme"
        @select="selectChat"
        @new="handleNewChat"
      />
    </div>
  </div>
</template>

<script>
import ChatMessage from "@/components/molecules/ChatMessage.vue";
import ChatInput from "@/components/molecules/ChatInput.vue";
import ChatList from "@/components/molecules/ChatList.vue";
import openAIAPI from "@/api/openai";

export default {
  name: "ChatbotPage",
  components: {
    ChatMessage,
    ChatInput,
    ChatList,
  },
  data() {
    return {
      messages: [],
      visibleMessages: [],
      isLoading: false,
      isListOpen: false,
      theme: "light",
      chatList: [],
      currentChatId: null,
    };
  },
  methods: {
    async sendMessage(message) {
      // 1. 메시지 유효성 검사 및 사용자 메시지 객체 생성
      // 빈 메시지인 경우 함수 종료
      if (!message) return;

      //사용자 메시지 객체를 생성하고 메시지 배열에 추가
      const userMessageObj = {
        type: "user",
        content: message,
        role: "user",
      };
      this.messages = [...this.messages, userMessageObj];

      // 2. 새 대화 생성 확인
      // 현재 진행 중인 대화가 없으면 새 대화를 생성
      if (!this.currentChatId) {
        this.createNewChat(this.messages);
      }

      // 3. OpenAI API 호출 준비
      // 로딩 상태 활성화
      this.isLoading = true;
      // 이전 대화 내용을 OpenAI API 형식에 맞게 가공
      try {
        const previousMessages = this.messages
          // 메시지에 role과 content 둘 중 하나라도 없으면 제외
          .filter((msg) => msg.role && msg.content)
          // role과 content만 추출하여 새로운 객체 생성 배열로 반환
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

        // 4. 챗봇 응답 처리
        // OpenAI API를 호출하여 응답을 받음
        const response = await openAIAPI.chat(message, previousMessages);
        // 받은 응답으로 봇 메시지 객체를 생성하고 메시지 배열에 추가
        const botMessageObj = {
          type: "bot",
          content: response,
          role: "assistant",
        };
        this.messages = [...this.messages, botMessageObj];

        // 5. 대화 정보 업데이트
        // 대화 목록의 미리보기 텍스트 업데이트
        this.updateChatPreview(this.currentChatId, message);
        // 새 대화이고 메시지가 2개 이상이면 대화 제목 자동 생성
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
        // 6. 에러 처리
        console.error("OpenAI API 오류:", error);
        this.messages = [
          ...this.messages,
          {
            type: "bot",
            content: "죄송합니다. 오류가 발생했습니다.",
            role: "assistant",
          },
        ];
      } finally {
        // 7. 마무리 작업
        // 로딩 상태 비활성화
        // 새 메시지가 추가된 후 스크롤을 최하단으로 이동
        this.isLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    // 메시지 추가되면 watch에서 감지해서 DOM작업 끝내고 스크롤 맨 아래로 내리기
    scrollToBottom() {
      const container = this.$refs.chatContainer;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    },

    optimizeMessages() {
      // 메시지가 50개를 초과하면 최근 50개만 화면에 표시
      // 성능 최적화를 위한 작업
      const MAX_VISIBLE_MESSAGES = 50;
      if (this.messages.length > MAX_VISIBLE_MESSAGES) {
        this.visibleMessages = this.messages.slice(-MAX_VISIBLE_MESSAGES);
      } else {
        this.visibleMessages = [...this.messages];
      }
    },

    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
    },

    toggleChatList() {
      this.isListOpen = !this.isListOpen;
    },

    goBack() {
      this.$router.push("/");
    },

    createNewChat(initialMessages = []) {
      const newChat = {
        id: Date.now(),
        title: "새 대화",
        preview: "새로운 대화를 시작하세요",
        messages: [...initialMessages],
      };

      // 배열의 맨 앞으로 새 대화 객체 추가
      this.chatList.unshift(newChat);
      // 현재 대화를 방금 만든 새 대화로 전환
      this.currentChatId = newChat.id;
    },

    selectChat(chatId) {
      // 현재 대화 저장
      if (this.currentChatId) {
        const currentChat = this.chatList.find(
          (chat) => chat.id === this.currentChatId
        );
        if (currentChat) {
          currentChat.messages = [...this.messages];
        }
      }

      // 선택한 대화로 전환
      this.currentChatId = chatId;
      const selectedChat = this.chatList.find((chat) => chat.id === chatId);
      if (selectedChat) {
        this.messages = [...selectedChat.messages];
      }
    },

    // 대화 목록의 미리보기 텍스트 업데이트
    updateChatPreview(chatId, message) {
      const chat = this.chatList.find((c) => c.id === chatId);
      if (chat) {
        chat.preview = message;
        chat.messages = [...this.messages];
      }
    },

    handleNewChat() {
      // 현재 대화 내용 저장하고 가는 로직직
      if (this.currentChatId) {
        const currentChat = this.chatList.find(
          (chat) => chat.id === this.currentChatId
        );
        if (currentChat) {
          currentChat.messages = [...this.messages];
        }
      }

      // 새 대화 생성
      this.createNewChat([]);
      // 메시지 배열 초기화
      this.messages = [];
    },

    async generateChatTitle() {
      try {
        // 현재 대화가 없거나 메시지가 2개 미만이면 함수 종료
        if (!this.currentChatId || this.messages.length < 2) return;

        // OpenAI API를 호출하여 대화 제목 생성
        const title = await openAIAPI.generateChatTitle(this.messages);

        // 생성된 제목이 있고 제목이 "새 대화"가 아니면 대화 제목 업데이트
        if (title && title !== "새 대화") {
          const chat = this.chatList.find((c) => c.id === this.currentChatId);
          if (chat) {
            chat.title = title;
          }
        }
      } catch (error) {
        console.error("대화 주제 생성 오류:", error);
      }
    },
  },
  watch: {
    messages: {
      handler() {
        // 1. 메시지 최적화
        this.optimizeMessages();
        // 2. DOM 업데이트 후 스크롤
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      deep: true,
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
  overflow: hidden;
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
}

.chatbot-container.dark {
  --bg-color: #1a1a1a;
  --text-color: #fff;
  --chat-bg: #2d2d2d;
  --border-color: #404040;
  --button-bg: #2c5282;
  --button-text: white;
  --input-bg: #333;
  --input-text: white;
  --chat-list-bg: #2d2d2d;
  --chat-item-hover: rgba(44, 82, 130, 0.3);
  --chat-item-active: rgba(44, 82, 130, 0.5);
}

.chat-layout {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

.main-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  background-color: var(--button-bg);
  color: var(--button-text);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: transform 0.2s ease;
}

.back-button:hover {
  transform: scale(1.1);
}

.back-button i {
  font-size: 1.2rem;
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
  background-color: #2c5282;
  color: #fff;
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

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 8px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background-color: var(--button-bg);
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
</style>
