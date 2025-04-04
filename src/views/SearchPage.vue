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
    <div v-if="isLoading && !items.length" class="loading">검색 중...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="items.length > 0" class="search-results">
      <div class="results-info">
        총 {{ Number(totalResults).toLocaleString() }}개의 검색결과
      </div>
      <div class="items-grid">
        <a
          v-for="item in items"
          :key="item.productId"
          :href="item.link"
          target="_blank"
          class="item-card"
        >
          <!-- 상품 이미지 영역 -->
          <div class="item-image">
            <img :src="item.image" :alt="item.title" />
          </div>
          <!-- 상품 정보 영역 -->
          <div class="item-content">
            <!-- if 있다면 상품 브랜드와 쇼핑몰 이름 영역 -->
            <div class="item-brand-mall">
              <span v-if="item.brand" class="brand">{{ item.brand }}</span>
              <span class="mall-name">{{ item.mallName }}</span>
            </div>
            <!-- 상품 제목 영역 -->
            <h3 class="item-title" v-html="item.title"></h3>
            <!-- if 있다면 상품 카테고리 영역 -->
            <div class="item-categories">
              <span v-if="item.category1" class="category">{{
                item.category1
              }}</span>
              <span v-if="item.category2" class="category">{{
                item.category2
              }}</span>
              <span v-if="item.category3" class="category">{{
                item.category3
              }}</span>
              <span v-if="item.category4" class="category">{{
                item.category4
              }}</span>
            </div>
            <!-- 상품 가격 영역 -->
            <div class="item-price">
              <strong>{{ Number(item.lprice).toLocaleString() }}</strong>
              <span class="won">원</span>
            </div>
          </div>
        </a>
      </div>
      <!-- 데이터 로딩 중 메시지 -->
      <div v-if="isLoading" class="loading-more">데이터를 불러오는 중...</div>
      <!-- 더 이상 데이터가 없는 경우 메시지 -->
      <div v-if="noMoreData" class="no-more-data">
        모든 상품을 불러왔습니다.
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
      searchQuery: "", // 검색어를 저장하는 변수
      isLoading: false, // 데이터 로딩 상태를 표시
      error: null, // 에러 메시지 저장
      items: [], // 검색된 상품들을 저장하는 배열
      currentPage: 1, // 현재 페이지 번호
      itemsPerPage: 20, // 한 페이지당 표시할 아이템 수
      totalResults: 0, // 전체 검색 결과 수
      noMoreData: false, // 더 이상 불러올 데이터가 없는지 여부
      isSearching: false, // 새로운 검색 진행 중인지 여부
    };
  },
  mounted() {
    // 컴포넌트가 마운트되면 스크롤 이벤트 리스너 추가
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    // 컴포넌트가 제거되기 전에 이벤트 리스너 제거 (메모리 누수 방지)
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    async handleSearch() {
      // 검색어가 비어있으면 실행하지 않음
      // 검색어가 비어있거나 공백만 있으면 true가 되어 함수 실행을 중단
      // 실제 검색어가 있으면 false가 되어 계속 실행
      if (!this.searchQuery.trim()) return;

      // 새로운 검색 시작 시 초기화
      this.items = []; // 기존 검색 결과 비우기
      this.currentPage = 1; // 페이지 번호 초기화
      this.noMoreData = false; // 데이터 더 있음으로 설정
      this.isSearching = true; // 검색 시작 표시

      await this.fetchItems(); // 데이터 가져오기
      this.isSearching = false; // 검색 완료 표시
    },

    async fetchItems() {
      // 이미 로딩 중이거나 더 이상 데이터가 없으면 중단
      if (this.isLoading || this.noMoreData) return;

      this.isLoading = true;
      this.error = null;

      try {
        // API 호출하여 데이터 가져오기
        const results = await shoppingAPI.search(this.searchQuery, {
          start: (this.currentPage - 1) * this.itemsPerPage + 1,
          display: this.itemsPerPage,
        });

        // 첫 검색일 경우 전체 결과 수 저장
        if (this.currentPage === 1) {
          this.totalResults = results.total;
        }

        // 기존 아이템 배열에 새로운 아이템 추가
        this.items = [...this.items, ...results.items];

        // 더 불러올 데이터가 있는지 확인
        const totalPages = Math.ceil(results.total / this.itemsPerPage);
        if (this.currentPage >= totalPages || this.items.length >= 100) {
          // 마지막 페이지이거나 100개 이상 로드했으면 종료
          this.noMoreData = true;
        } else {
          // 다음 페이지로 이동
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
      // 로딩 중이거나 검색 중이거나 더 이상 데이터가 없으면 중단
      if (this.isLoading || this.isSearching || this.noMoreData) return;

      // 현재 스크롤 위치 계산 (현재 스크롤 위치 + 화면 높이)
      const scrollPosition = window.pageYOffset + window.innerHeight;
      // 전체 문서 높이
      const documentHeight = document.documentElement.scrollHeight;
      // 스크롤 임계값 (전체 높이의 90%)
      const scrollThreshold = documentHeight * 0.9;

      // 스크롤이 임계값을 넘으면 새로운 데이터 로드
      if (scrollPosition > scrollThreshold) {
        this.fetchItems();
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
  width: 90%;
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.item-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
}

.item-card:hover {
  transform: translateY(-4px);
}

.item-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-bottom: 1px solid #eee;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-content {
  padding: 15px;
}

.item-brand-mall {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.brand {
  color: #03c75a;
  font-weight: bold;
  font-size: 13px;
}

.mall-name {
  color: #666;
  font-size: 13px;
}

.item-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  line-height: 1.4;
  height: 2.8em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-categories {
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

.item-price {
  font-size: 16px;
  color: #000;
}

.item-price strong {
  font-size: 18px;
  font-weight: bold;
}

.won {
  font-size: 14px;
  margin-left: 2px;
}

.loading-more {
  text-align: center;
  padding: 20px;
  color: #666;
}

.no-more-data {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}
</style>
