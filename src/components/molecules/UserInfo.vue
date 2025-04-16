<template>
  <div class="user-info">
    <BaseText tag="span" variant="brand" class="username">
      <i class="fas fa-user"></i> {{ username }}
    </BaseText>
    <BaseButton
      variant="primary"
      @click="$emit('logout')"
      class="logout-button"
    >
      <i class="fas fa-sign-out-alt"></i> 로그아웃
    </BaseButton>
  </div>
</template>

<script>
import BaseButton from "@/components/atoms/BaseButton.vue";
import BaseText from "@/components/atoms/BaseText.vue";

export default {
  name: "UserInfo",
  components: {
    BaseButton,
    BaseText,
  },
  props: {
    username: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #03c75a;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.logout-button {
  padding: 10px 16px;
}
</style>
