<template>
  <transition name="slide">
    <div v-if="isOpen" class="chat-list">
      <h2>대화 목록</h2>
      <div class="chat-items">
        <div
          v-for="(chat, index) in chatList"
          :key="index"
          :class="['chat-item', { active: currentChatId === chat.id }]"
          @click="$emit('select', chat.id)"
        >
          <div class="chat-item-title">{{ chat.title }}</div>
          <div class="chat-item-preview">{{ chat.preview }}</div>
        </div>
      </div>
      <BaseButton
        class="new-chat-btn"
        @click="$emit('new')"
        :backgroundColor="theme === 'dark' ? '#2c5282' : '#03c75a'"
        :textColor="theme === 'dark' ? '#fff' : '#fff'"
      >
        <i class="fas fa-plus"></i> 새 대화
      </BaseButton>
    </div>
  </transition>
</template>

<script>
import BaseButton from "@/components/atoms/BaseButton.vue";

export default {
  name: "ChatList",
  components: {
    BaseButton,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    chatList: {
      type: Array,
      required: true,
    },
    currentChatId: {
      type: Number,
      required: true,
    },
    theme: {
      type: String,
      required: true,
      validator: (value) => ["light", "dark"].includes(value),
    },
  },
  emits: ["select", "new"],
};
</script>

<style scoped>
.chat-list {
  width: 300px;
  background-color: var(--chat-list-bg);
  border-left: 1px solid var(--border-color);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.chat-items {
  flex: 1;
  overflow-y: auto;
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
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
