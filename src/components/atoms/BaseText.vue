<template>
  <component :is="tag" :class="['base-text', variant, { truncate }]">
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: "BaseText",
  props: {
    tag: {
      type: String,
      default: "p",
      validator: (value) => ["p", "h1", "h2", "h3", "span"].includes(value),
    },
    variant: {
      type: String,
      default: "normal",
      validator: (value) =>
        ["normal", "subtitle", "error", "brand"].includes(value),
    },
    truncate: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.base-text {
  margin: 0;
  line-height: 1.4;
}

.base-text.subtitle {
  font-size: 18px;
  color: #666;
}

.base-text.error {
  color: #d32f2f;
  font-size: 14px;
}

.base-text.brand {
  color: #03c75a;
  font-weight: bold;
}

.base-text.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
