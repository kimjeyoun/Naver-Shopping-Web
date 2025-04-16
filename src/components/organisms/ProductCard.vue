<template>
  <a :href="item.link" target="_blank" class="product-card">
    <div class="product-image">
      <img :src="item.image" :alt="item.title" />
    </div>
    <div class="product-content">
      <div class="product-brand-mall">
        <BaseText v-if="item.brand" tag="span" variant="brand" class="brand">
          {{ item.brand }}
        </BaseText>
        <BaseText tag="span" variant="normal" class="mall-name">
          {{ item.mallName }}
        </BaseText>
      </div>
      <BaseText tag="h3" class="product-title" v-html="item.title"></BaseText>
      <div class="product-categories">
        <BaseText
          v-for="(category, index) in filteredCategories"
          :key="index"
          tag="span"
          variant="normal"
          class="category"
        >
          {{ category }}
        </BaseText>
      </div>
      <div class="product-price">
        <strong>{{ Number(item.lprice).toLocaleString() }}</strong>
        <span class="won">원</span>
      </div>
    </div>
  </a>
</template>

<script>
import BaseText from "@/components/atoms/BaseText.vue";

export default {
  name: "ProductCard",
  components: {
    BaseText,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    filteredCategories() {
      return [
        this.item.category1,
        this.item.category2,
        this.item.category3,
        this.item.category4,
      ].filter(Boolean);
    },
  },
};
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-bottom: 1px solid #eee;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-content {
  padding: 15px;
}

.product-brand-mall {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.mall-name {
  color: #666;
  font-size: 13px;
}

.product-title {
  margin: 0 0 8px 0;
  height: 2.8em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.category {
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
}

.product-price {
  font-size: 16px;
  color: #000;
}

.product-price strong {
  font-size: 18px;
  font-weight: bold;
}

.won {
  font-size: 14px;
  margin-left: 2px;
}
</style>
