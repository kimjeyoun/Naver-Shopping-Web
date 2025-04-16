<template>
  <div :class="['message', type]">
    <div class="message-content">
      {{ content }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatMessage",
  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ["user", "bot"].includes(value),
    },
    content: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.message {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  margin: 4px 0;
  word-break: break-word;
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
</style>
