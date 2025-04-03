<template>
  <div class="search-container">
    <div class="header">
      <div class="logout-wrapper">
        <button class="logout-button" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i> 로그아웃
        </button>
      </div>
    </div>
    <div class="search-header">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="검색어를 입력하세요"
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button class="search-button" @click="handleSearch">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="loading">검색 중...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="searchResults && searchResults.items" class="search-results">
      <div class="results-info">총 {{ searchResults.total }}개의 검색결과</div>
      <div class="items-grid">
        <div
          v-for="item in searchResults.items"
          :key="item.productId"
          class="item-card"
        >
          <h3>{{ item.title }}</h3>
          <p>가격: {{ Number(item.lprice).toLocaleString() }}원</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "@/auth";
import shoppingAPI from "@/api/shopping";

export default {
  name: "SearchPage",
  data() {
    return {
      searchQuery: "",
      isLoading: false,
      error: null,
      searchResults: null,
    };
  },
  methods: {
    async handleSearch() {
      if (!this.searchQuery.trim()) return;

      this.isLoading = true;
      this.error = null;

      try {
        const results = await shoppingAPI.search(this.searchQuery);
        console.log("검색 결과:", results);
        this.searchResults = results;
      } catch (error) {
        this.error = "검색 중 오류가 발생했습니다.";
        console.error("검색 오류:", error);
      } finally {
        this.isLoading = false;
      }
    },
    handleLogout() {
      auth.logout();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.search-container {
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f6f7;
}

.header {
  position: fixed;
  top: 0;
  right: 0;
  padding: 20px;
  z-index: 100;
}

.logout-wrapper {
  display: flex;
  justify-content: flex-end;
}

.logout-button {
  padding: 8px 16px;
  background-color: #03c75a;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logout-button:hover {
  background-color: #02a347;
}

.search-header {
  max-width: 800px;
  margin: 0 auto;
  padding-top: 40px;
}

.search-box {
  display: flex;
  gap: 10px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #03c75a;
  border-radius: 4px;
  outline: none;
}

.search-input:focus {
  border-color: #02a347;
}

.search-button {
  padding: 0 24px;
  background-color: #03c75a;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #02a347;
}

.loading {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.error {
  text-align: center;
  margin-top: 20px;
  color: #d32f2f;
}

.search-results {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.results-info {
  margin-bottom: 20px;
  font-size: 16px;
  color: #666;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.item-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.item-card h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #333;
}

.item-card p {
  margin: 0;
  color: #03c75a;
  font-weight: bold;
}
</style>
