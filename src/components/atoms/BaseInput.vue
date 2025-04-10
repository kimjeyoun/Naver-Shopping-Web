<template>
  <div class="input-wrapper">
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
  color: #666;
}

.base-input {
  width: 100%;
  padding: 12px;
  padding-left: 40px;
  border: 2px solid #03c75a;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
}

.base-input:focus {
  border-color: #02a347;
  box-shadow: 0 0 0 2px rgba(3, 199, 90, 0.2);
}
</style>
