<template>
  <div class="input-container">
    <div class="input-wrapper">
      <BaseInput
        class="chat-input"
        v-model="inputValue"
        placeholder="메시지를 입력하세요..."
        @keyup.enter="handleSend"
        :backgroundColor="theme === 'dark' ? '#333' : 'white'"
        :textColor="theme === 'dark' ? '#fff' : '#333'"
        :borderColor="theme === 'dark' ? '#404040' : '#03c75a'"
        :iconColor="theme === 'dark' ? '#aaa' : '#666'"
      />
    </div>
    <BaseButton
      @click="handleSend"
      :disabled="!inputValue.trim()"
      class="send-button"
      :backgroundColor="theme === 'dark' ? '#2c5282' : '#03c75a'"
      :textColor="theme === 'dark' ? '#fff' : '#fff'"
    >
      전송
    </BaseButton>
  </div>
</template>

<script>
import BaseInput from "@/components/atoms/BaseInput.vue";
import BaseButton from "@/components/atoms/BaseButton.vue";

export default {
  name: "ChatInput",
  components: {
    BaseInput,
    BaseButton,
  },
  props: {
    theme: {
      type: String,
      required: true,
      validator: (value) => ["light", "dark"].includes(value),
    },
  },
  data() {
    return {
      inputValue: "",
    };
  },
  methods: {
    handleSend() {
      if (!this.inputValue.trim()) return;
      this.$emit("send", this.inputValue);
      this.inputValue = "";
    },
  },
};
</script>

<style scoped>
.input-container {
  padding: 20px;
  background-color: var(--chat-bg);
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 2;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.input-wrapper {
  flex: 1;
  display: flex;
}

.chat-input {
  width: 100%;
  flex: 1;
}

.send-button {
  border: none;
  padding: 14px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
