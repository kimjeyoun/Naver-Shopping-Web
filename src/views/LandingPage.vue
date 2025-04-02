<template>
  <div class="landing-container">
    <FallingLetters :isActive="currentSection === 0" />
    <div class="animated-background"></div>
    <section class="section first-section">
      <div class="content">
        <h1 class="animate-text">Welcome to Naver Shopping</h1>
        <p class="animate-text-delay">스크롤을 내려서 더 알아보세요</p>
      </div>
      <div class="scroll-indicator">
        <span class="arrow">↓</span>
      </div>
    </section>

    <section class="section second-section">
      <div class="content">
        <h2 class="animate-text">쉽고 편리한 쇼핑</h2>
        <p class="animate-text-delay">네이버 쇼핑의 다양한 상품을 만나보세요</p>
      </div>
    </section>

    <section class="section third-section">
      <div class="content">
        <h2 class="animate-text">시작하기</h2>
        <button class="login-button animate-text-delay" @click="goToLogin">
          로그인하기
        </button>
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
      currentSection: 0,
    };
  },
  mounted() {
    this.initScrollAnimation();
  },
  methods: {
    initScrollAnimation() {
      const sections = document.querySelectorAll(".section");
      let isScrolling = false;

      const scrollToSection = (index) => {
        isScrolling = true;
        this.currentSection = index;
        sections[index].scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          isScrolling = false;
        }, 1000);
      };

      window.addEventListener("wheel", (e) => {
        if (isScrolling) return;

        if (e.deltaY > 0 && this.currentSection < sections.length - 1) {
          scrollToSection(this.currentSection + 1);
        } else if (e.deltaY < 0 && this.currentSection > 0) {
          scrollToSection(this.currentSection - 1);
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
  position: relative;
}

.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

.section {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  scroll-snap-align: start;
  position: relative;
  background: rgba(0, 0, 0, 0.3);
}

.first-section {
  background: linear-gradient(
    135deg,
    rgba(26, 35, 126, 0.7),
    rgba(13, 71, 161, 0.7)
  );
  color: white;
}

.second-section {
  background: linear-gradient(
    135deg,
    rgba(0, 77, 64, 0.7),
    rgba(0, 105, 92, 0.7)
  );
  color: white;
}

.third-section {
  background: linear-gradient(
    135deg,
    rgba(49, 27, 146, 0.7),
    rgba(69, 39, 160, 0.7)
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
  transition: transform 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards 0.6s;
}

.login-button:hover {
  transform: scale(1.05);
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-text {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards;
}

.animate-text-delay {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards 0.3s;
}
</style>
