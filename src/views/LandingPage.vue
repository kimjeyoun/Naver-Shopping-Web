<template>
  <div class="landing-container">
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
        <h2>쉽고 편리한 쇼핑</h2>
        <p>네이버 쇼핑의 다양한 상품을 만나보세요</p>
      </div>
    </section>

    <section class="section third-section">
      <div class="content">
        <h2>시작하기</h2>
        <button class="login-button" @click="goToLogin">로그인하기</button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
  mounted() {
    this.initScrollAnimation();
  },
  methods: {
    initScrollAnimation() {
      const sections = document.querySelectorAll(".section");
      let isScrolling = false;
      let currentSection = 0;

      const scrollToSection = (index) => {
        isScrolling = true;
        sections[index].scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          isScrolling = false;
        }, 1000);
      };

      window.addEventListener("wheel", (e) => {
        if (isScrolling) return;

        if (e.deltaY > 0 && currentSection < sections.length - 1) {
          currentSection++;
          scrollToSection(currentSection);
        } else if (e.deltaY < 0 && currentSection > 0) {
          currentSection--;
          scrollToSection(currentSection);
        }
      });
    },
    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.landing-container {
  height: 100vh;
  overflow-y: hidden;
}

.section {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  scroll-snap-align: start;
  position: relative;
}

.first-section {
  background: linear-gradient(135deg, #1a237e, #0d47a1);
  color: white;
}

.second-section {
  background: linear-gradient(135deg, #004d40, #00695c);
  color: white;
}

.third-section {
  background: linear-gradient(135deg, #311b92, #4527a0);
  color: white;
}

.content {
  text-align: center;
  padding: 2rem;
}

.content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.content p {
  font-size: 1.2rem;
  opacity: 0.9;
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
  transition: transform 0.3s ease;
}

.login-button:hover {
  transform: scale(1.05);
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}
</style>
