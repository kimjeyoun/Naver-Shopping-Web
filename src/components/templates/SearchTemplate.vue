<template>
  <div class="search-container" :class="{ 'has-results': items.length > 0 }">
    <div class="header">
      <UserInfo :username="username" @logout="$emit('logout')" />
    </div>
    <div class="search-header">
      <SearchBox @search="$emit('search', $event)" />
      <SortFilter :current-sort="currentSort" @sort="$emit('sort', $event)" />
    </div>
    <div v-if="isLoading && !items.length" class="loading">
      <BaseText>검색 중...</BaseText>
    </div>
    <div v-if="error" class="error">
      <BaseText variant="error">{{ error }}</BaseText>
    </div>
    <ProductGrid
      v-if="items.length > 0"
      :items="items"
      :total-results="totalResults"
      :is-loading="isLoading"
      :no-more-data="noMoreData"
    />
  </div>
</template>

<script>
import BaseText from "@/components/atoms/BaseText.vue";
import UserInfo from "@/components/molecules/UserInfo.vue";
import SearchBox from "@/components/molecules/SearchBox.vue";
import SortFilter from "@/components/molecules/SortFilter.vue";
import ProductGrid from "@/components/organisms/ProductGrid.vue";

export default {
  name: "SearchTemplate",
  components: {
    BaseText,
    UserInfo,
    SearchBox,
    SortFilter,
    ProductGrid,
  },
  props: {
    username: {
      type: String,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: null,
    },
    items: {
      type: Array,
      default: () => [],
    },
    totalResults: {
      type: Number,
      default: 0,
    },
    noMoreData: {
      type: Boolean,
      default: false,
    },
    currentSort: {
      type: String,
      default: "sim",
    },
  },
};
</script>

<style scoped>
.search-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f6f7;
  overflow: hidden; /* 초기 상태에서는 스크롤 숨김 */
}

/* 검색 결과가 있을 때 스크롤 허용 */
.search-container.has-results {
  overflow: visible;
  height: auto;
}

.header {
  padding: 20px;
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  background-color: #f5f6f7;
}

.search-header {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  background-color: #f5f6f7;
  z-index: 99;
}

.loading,
.error {
  text-align: center;
  margin-top: 20px;
}
</style>
