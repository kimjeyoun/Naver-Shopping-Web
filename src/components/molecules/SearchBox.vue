<template>
  <div class="search-box">
    <BaseInput
      v-model="searchQuery"
      placeholder="검색어를 입력하세요"
      icon="fa-search"
      @enter="handleSearch"
    />
    <BaseButton variant="primary" @click="handleSearch">
      <i class="fas fa-search"></i>
    </BaseButton>
  </div>
</template>

<script>
import BaseInput from "@/components/atoms/BaseInput.vue";
import BaseButton from "@/components/atoms/BaseButton.vue";

export default {
  name: "SearchBox",
  components: {
    BaseInput,
    BaseButton,
  },
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    handleSearch() {
      this.$emit("search", this.searchQuery);
    },
  },
};
</script>

<style scoped>
.search-box {
  display: flex;
  gap: 10px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
