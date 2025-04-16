<template>
  <div class="product-grid">
    <div class="results-info">
      <BaseText variant="subtitle">
        총 {{ Number(totalResults).toLocaleString() }}개의 검색결과
      </BaseText>
    </div>
    <div class="items-grid">
      <ProductCard v-for="item in items" :key="item.productId" :item="item" />
    </div>
    <div v-if="isLoading" class="loading-more">
      <BaseText>데이터를 불러오는 중...</BaseText>
    </div>
    <div v-if="noMoreData" class="no-more-data">
      <BaseText>모든 상품을 불러왔습니다.</BaseText>
    </div>
  </div>
</template>

<script>
import BaseText from "@/components/atoms/BaseText.vue";
import ProductCard from "./ProductCard.vue";

export default {
  name: "ProductGrid",
  components: {
    BaseText,
    ProductCard,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    totalResults: {
      type: Number,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    noMoreData: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.product-grid {
  width: 90%;
  margin: 20px auto;
  padding: 20px;
}

.results-info {
  margin-bottom: 20px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.loading-more,
.no-more-data {
  text-align: center;
  padding: 20px;
}
</style>
