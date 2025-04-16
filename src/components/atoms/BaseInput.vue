<template>
  <div class="input-wrapper" :style="inputStyles">
    <i v-if="icon" :class="['fas', icon]"></i>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="base-input"
      @input="$emit('update:modelValue', $event.target.value)"
      @keyup.enter="$emit('enter')"
    />
  </div>
</template>

<script>
export default {
  name: "BaseInput",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    placeholder: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    borderColor: {
      type: String,
      default: "#03c75a",
    },
    backgroundColor: {
      type: String,
      default: "white",
    },
    textColor: {
      type: String,
      default: "#333",
    },
    iconColor: {
      type: String,
      default: "#666",
    },
  },
  computed: {
    inputStyles() {
      return {
        "--input-border": this.borderColor,
        "--input-bg": this.backgroundColor,
        "--input-text": this.textColor,
        "--input-icon": this.iconColor,
      };
    },
  },
  emits: ["update:modelValue", "enter"],
};
</script>

<style scoped>
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-wrapper i {
  position: absolute;
  left: 12px;
  color: var(--input-icon);
}

.base-input {
  width: 100%;
  padding: 12px;
  padding-left: 40px;
  border: 2px solid var(--input-border);
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  background-color: var(--input-bg);
  color: var(--input-text);
}

.base-input:focus {
  border-color: var(--input-border);
  box-shadow: 0 0 0 2px rgba(3, 199, 90, 0.2);
}

.base-input::placeholder {
  color: var(--input-text);
  opacity: 0.5;
}
</style>
