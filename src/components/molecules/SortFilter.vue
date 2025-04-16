<template>
  <div class="sort-filter" @click.stop>
    <BaseButton variant="filter" class="filter-button" @click="toggleOptions">
      <i class="fas fa-filter"></i> 필터
    </BaseButton>
    <div v-show="showOptions" class="sort-dropdown" @click.stop>
      <BaseButton
        v-for="option in sortOptions"
        :key="option.value"
        variant="secondary"
        :is-active="currentSort === option.value"
        @click="handleSort(option.value)"
        class="sort-option"
      >
        {{ option.label }}
      </BaseButton>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/atoms/BaseButton.vue";

export default {
  name: "SortFilter",
  components: {
    BaseButton,
  },
  props: {
    currentSort: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showOptions: false,
      sortOptions: [
        { value: "sim", label: "정확도순" },
        { value: "date", label: "날짜순" },
        { value: "asc", label: "가격 낮은순" },
        { value: "dsc", label: "가격 높은순" },
      ],
    };
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    toggleOptions() {
      this.showOptions = !this.showOptions;
    },
    handleSort(value) {
      this.showOptions = false;
      this.$emit("sort", value);
    },
    handleClickOutside(event) {
      const sortFilter = this.$el;
      if (this.showOptions && !sortFilter.contains(event.target)) {
        this.showOptions = false;
      }
    },
  },
};
</script>

<style scoped>
.sort-filter {
  position: relative;
  margin-top: 15px;
  z-index: 1000;
}

.filter-button {
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.sort-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  min-width: 150px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sort-option {
  width: 100%;
  text-align: left;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background: white;
}

.sort-option:hover {
  background-color: #f5f5f5;
}

.sort-option.active {
  background-color: rgb(210, 251, 228);
  color: #03c75a;
  font-weight: bold;
}
</style>
