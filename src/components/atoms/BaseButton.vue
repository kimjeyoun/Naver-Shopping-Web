<template>
  <!-- 동적 클래스 바인딩 -->
  <!-- variant가 'primary'이고 isActive가 true일 때 -->
  <!-- 결과적으로 적용되는 클래스: "base-button primary active" -->
  <!-- emits: 컴포넌트가 발생시킬 수 있는 이벤트를 명시적으로 선언 -->
  <!-- 여기서 click을 emit으로 선언했기 때문에 위에서 basebutton을 사용하면서 @click이 사용 가능, 전달의 개념 -->
  <button
    :class="['base-button', variant, { active: isActive }]"
    :style="buttonStyles"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "BaseButton",
  emits: ["click"],
  props: {
    variant: {
      type: String,
      default: "primary",
      validator: (value) => ["primary", "secondary", "filter"].includes(value),
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: "#03c75a",
    },
    textColor: {
      type: String,
      default: "white",
    },
    borderColor: {
      type: String,
      default: "",
    },
  },
  computed: {
    buttonStyles() {
      const styles = {
        "--button-bg": this.backgroundColor,
        "--button-text": this.textColor,
        "--button-border": this.borderColor || this.backgroundColor,
      };
      return styles;
    },
  },
};
</script>

<style scoped>
.base-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.base-button.primary {
  background-color: var(--button-bg);
  color: var(--button-text);
  border: none;
}

.base-button.primary:hover {
  opacity: 0.9;
}

.base-button.secondary {
  background-color: transparent;
  color: var(--button-bg);
  border: 1px solid var(--button-border);
}

.base-button.secondary:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.base-button.filter {
  background-color: white;
  border: 1px solid var(--button-border);
  color: var(--button-bg);
}

.base-button.filter:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.base-button.active {
  background-color: rgba(0, 0, 0, 0.1);
  color: var(--button-bg);
  font-weight: bold;
}
</style>
