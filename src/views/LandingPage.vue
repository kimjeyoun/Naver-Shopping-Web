<template>
  <div class="landing-container">
    <FallingLetters :isActive="currentSection === 0" />
    <div class="animated-background"></div>
    <section class="section first-section">
      <div class="content">
        <h1>Welcome to Naver Shopping</h1>
        <p>스크롤을 내려서 더 알아보세요</p>
      </div>
      <div class="scroll-indicator">
        <span class="arrow">↓</span>
      </div>
    </section>

    <section class="section second-section">
      <div class="content">
        <div class="text-container">
          <h2 class="moving-text">쉽고 편리한 쇼핑</h2>
          <p class="moving-text">네이버 쇼핑의 다양한 상품을 만나보세요</p>
        </div>
      </div>
    </section>

    <section class="section third-section">
      <div class="content">
        <h2>시작하기</h2>
        <div class="button-container">
          <button class="login-button" @click="goToLogin">로그인하기</button>
          <button class="chatbot-button" @click="goToChatbot">챗봇 문의</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import FallingLetters from "@/components/FallingLetters.vue";

export default {
  name: "LandingPage",
  components: {
    FallingLetters,
  },
  data() {
    return {
      currentSection: 0, // 현재 보고 있는 섹션의 인덱스 (0, 1, 2)
    };
  },
  watch: {
    currentSection: {
      // 값의 변화를 감시
      immediate: true, // 즉시 실행
      handler(newValue) {
        this.$nextTick(() => {
          const sections = document.querySelectorAll(".section");
          sections.forEach((section, index) => {
            if (index === newValue) {
              section.classList.add("active");
            } else {
              section.classList.remove("active");
            }
          });
        });
      },
    },
  },
  methods: {
    initScrollAnimation() {
      const sections = document.querySelectorAll(".section");
      let isScrolling = false;

      const scrollToSection = (index) => {
        isScrolling = true; // 스크롤 중임을 표시
        this.currentSection = index; // 현재 섹션 번호 업데이트
        sections[index].scrollIntoView({ behavior: "smooth" }); // 부드러운 스크롤로 해당 섹션으로 이동
        setTimeout(() => {
          isScrolling = false; // 1초 후에 스크롤 가능 상태로 변경
        }, 1000);
      };

      window.addEventListener("wheel", (e) => {
        if (isScrolling) return; // 현재 스크롤 중이면 추가 스크롤 무시

        if (e.deltaY > 0 && this.currentSection < sections.length - 1) {
          // e.deltaY: 휠 이벤트의 방향과 강도
          // 양수: 아래로 스크롤
          // this.currentSection < sections.length - 1: 마지막 섹션이 아닐 때만 다음 섹션으로 이동 가능
          scrollToSection(this.currentSection + 1);
        } else if (e.deltaY < 0 && this.currentSection > 0) {
          // e.deltaY: 휠 이벤트의 방향과 강도
          // 음수: 위로 스크롤
          // this.currentSection > 0: 첫 번째 섹션이 아닐 때만 이전 섹션으로 이동 가능
          scrollToSection(this.currentSection - 1);
        }
      });
    },
    goToLogin() {
      this.$router.push("/login");
    },
    goToChatbot() {
      this.$router.push("/chatbot");
    },
  },
  mounted() {
    this.initScrollAnimation();
  },
};
</script>

<style scoped>
.landing-container {
  height: 100vh;
  overflow-y: hidden;
  /* 세로 스크롤바를 숨김 (페이지 전환은 JavaScript로 제어) */
  position: relative;
  /* 내부 요소들의 위치 기준점 역할 */
}

.animated-background {
  position: fixed;
  /* 스크롤해도 배경이 고정됨 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  /* 다른 콘텐츠 뒤에 위치 */
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite; /* 15초 동안 무한 반복 */
}

.section {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* 화면 전체 높이를 차지하며 내용을 중앙 정렬 */
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(0, 77, 64, 0.7),
    rgba(0, 105, 92, 0.7)
  );
  color: white;
}

.content {
  text-align: center;
  padding: 2rem;
}

.content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards;
}

.content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards;
}

.content p {
  font-size: 1.2rem;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards 0.3s;
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s infinite;
}

.arrow {
  font-size: 2rem;
  color: white;
}

.login-button {
  margin-top: 2rem;
  padding: 1rem 3rem;
  font-size: 1.2rem;
  background-color: white;
  color: #4527a0;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  opacity: 0; /* 초기 상태는 투명 */
  transform: translateY(20px); /* 초기 위치는 아래로 20px */
}

/* 세 번째 섹션이 활성화될 때만 애니메이션 적용 */
.third-section.active .login-button {
  animation: fadeInUp 0.8s ease forwards 0.3s;
}

/* 호버 효과는 별도로 관리 */
.login-button:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%; /* 시작: 왼쪽 중앙 */
  }
  50% {
    background-position: 100% 50%; /* 중간: 오른쪽 중앙 */
  }
  100% {
    background-position: 0% 50%; /* 끝: 다시 왼쪽 중앙 */
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0); /* 기본 위치 */
  }
  40% {
    transform: translateY(-30px); /* 위로 30px 이동 */
  }
  60% {
    transform: translateY(-15px); /* 위로 15px 이동 */
  }
}

@keyframes fadeInUp {
  /* 아래에서 위로 */
  from {
    opacity: 0; /* 완전 투명 */
    transform: translateY(20px); /* 아래로 20px 이동된 상태 */
  }
  to {
    opacity: 1; /* 완전 불투명 */
    transform: translateY(0); /* 원래 위치로 */
  }
}

.text-container {
  perspective: 1000px; /* 3D 효과를 위한 원근감 설정 */
  display: flex; /* Flexbox 레이아웃 사용 */
  flex-direction: column; /* 자식 요소들을 세로로 배치 */
  gap: 1rem; /* 자식 요소들 사이의 간격을 1rem으로 설정 */
}

.moving-text {
  font-weight: bold;
  color: white;
  opacity: 0;
  transform: translateZ(-800px); /* 3D 공간에서 뒤쪽으로 800px 이동 */
}

/* :first-child는 "부모의 첫 번째 자식이면서 해당 클래스를 가진 요소"를 선택
:last-child는 "부모의 마지막 자식이면서 해당 클래스를 가진 요소"를 선택 */

.second-section.active .moving-text {
  animation: moveIn 1.5s ease-out forwards;
}

@keyframes moveIn {
  0% {
    opacity: 0;
    transform: translateZ(-800px);
  }
  50% {
    opacity: 0.5;
    transform: translateZ(-400px);
  }
  100% {
    opacity: 1;
    transform: translateZ(0);
  }
}

.button-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 2rem;
}

.chatbot-button {
  margin-top: 2rem;
  padding: 1rem 3.3rem;
  font-size: 1.2rem;
  background-color: #4527a0;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px);
}

.third-section.active .chatbot-button {
  animation: fadeInUp 0.8s ease forwards 0.5s;
}

.chatbot-button:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}
</style>
