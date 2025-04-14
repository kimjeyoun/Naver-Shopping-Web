<template>
  <SearchTemplate
    :username="currentUser?.username"
    :is-loading="isLoading"
    :error="error"
    :items="items"
    :total-results="totalResults"
    :no-more-data="noMoreData"
    :current-sort="currentSort"
    @logout="handleLogout"
    @search="handleSearch"
    @sort="changeSort"
  />
</template>

<script>
import auth from "@/auth";
import shoppingAPI from "@/api/shopping";
import SearchTemplate from "@/components/templates/SearchTemplate.vue";

export default {
  name: "SearchPage",
  components: {
    SearchTemplate,
  },
  data() {
    return {
      searchQuery: "",
      isLoading: false,
      error: null,
      items: [],
      currentPage: 1,
      itemsPerPage: 20,
      totalResults: 0,
      noMoreData: false,
      isSearching: false,
      currentSort: "sim",
      currentUser: auth.checkAuth(),
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    async handleSearch(query) {
      if (!query.trim()) return;

      this.searchQuery = query;
      this.items = [];
      this.currentPage = 1;
      this.noMoreData = false;
      this.isSearching = true;

      await this.fetchItems();
      this.isSearching = false;
    },

    async fetchItems() {
      if (this.isLoading || this.noMoreData) return;

      this.isLoading = true;
      this.error = null;

      try {
        const results = await shoppingAPI.search(this.searchQuery, {
          start: (this.currentPage - 1) * this.itemsPerPage + 1,
          display: this.itemsPerPage,
          sort: this.currentSort,
        });

        if (this.currentPage === 1) {
          this.totalResults = results.total;
        }

        this.items = [...this.items, ...results.items];

        const totalPages = Math.ceil(results.total / this.itemsPerPage);
        if (this.currentPage >= totalPages || this.items.length >= 100) {
          this.noMoreData = true;
        } else {
          this.currentPage += 1;
        }
      } catch (error) {
        this.error = "검색 중 오류가 발생했습니다.";
        console.error("검색 오류:", error);
      } finally {
        this.isLoading = false;
      }
    },

    handleScroll() {
      if (
        !this.searchQuery.trim() ||
        !this.items.length ||
        this.isLoading ||
        this.isSearching ||
        this.noMoreData
      )
        return;

      const scrollPosition = window.pageYOffset + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollThreshold = documentHeight * 0.9;

      if (scrollPosition > scrollThreshold) {
        this.fetchItems();
      }
    },

    handleLogout() {
      auth.logout();
      this.$router.push("/login");
    },

    async changeSort(sortValue) {
      if (!this.searchQuery.trim()) {
        this.error = "검색어를 입력해주세요.";
        return;
      }

      this.currentSort = sortValue;
      this.items = [];
      this.currentPage = 1;
      this.noMoreData = false;
      this.error = null;

      await this.fetchItems();
    },
  },
};
</script>

<style>
.search-container {
  min-height: 100vh;
  height: 100vh;
  padding: 20px;
  background-color: #f5f6f7;
  overflow-y: auto;
}

.header {
  position: relative;
  top: 0;
  right: 0;
  padding: 20px;
  z-index: 100;
  display: flex;
  justify-content: flex-end;
}

.search-header {
  max-width: 800px;
  margin: 0 auto;
  padding-top: 40px;
}

.loading,
.error {
  text-align: center;
  margin-top: 20px;
}

/* 검색 결과가 없을 때는 컨테이너 높이를 100vh로 고정 */
.search-container:not(:has(.product-grid)) {
  height: 100vh;
  overflow: hidden;
}
</style>
