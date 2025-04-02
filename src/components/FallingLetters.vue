<template>
  <div class="falling-container">
    <div class="bottom-line"></div>
    <div
      v-for="(letter, index) in letters"
      :key="index"
      class="falling-letter"
      :style="letter.style"
    >
      N
    </div>
  </div>
</template>

<script>
export default {
  name: "FallingLetters",
  props: {
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      letters: [],
      letterCount: 70,
    };
  },
  methods: {
    createLetters() {
      this.letters = [];
      // 바닥에 쌓을 때 사용할 위치 배열
      const positions = [];
      for (let i = 0; i < 20; i++) {
        positions.push(i * 5 + Math.random() * 3); // 5% 간격으로 약간의 랜덤 변동
      }

      for (let i = 0; i < this.letterCount; i++) {
        const delay = Math.random() * 3;
        const duration = 1.5 + Math.random() * 1.5;
        // 시작 위치는 전체 화면에 무작위로
        const startX = Math.random() * 100;
        // 최종 위치는 positions 배열에서 무작위로 선택
        const positionIndex = Math.floor(Math.random() * positions.length);
        const finalX = positions[positionIndex];

        const finalRotation = -40 + Math.random() * 80; // -40도 ~ 40도 사이 회전
        const size = 50 + Math.random() * 20; // 작은 사이즈 (30px ~ 50px)

        this.letters.push({
          style: {
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            fontSize: `${size}px`,
            "--start-x": `${startX}%`,
            "--final-x": `${finalX}%`,
            "--final-rotation": `${finalRotation}deg`,
          },
        });
      }
    },
  },
  watch: {
    isActive(newValue) {
      if (newValue) {
        this.createLetters();
      } else {
        this.letters = [];
      }
    },
  },
  mounted() {
    if (this.isActive) {
      this.createLetters();
    }
  },
};
</script>

<style scoped>
.falling-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  overflow: hidden;
}

.bottom-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.3);
}

.falling-letter {
  position: absolute;
  top: -100px;
  left: var(--start-x);
  color: rgba(255, 255, 255, 0.9);
  font-weight: bold;
  font-family: Arial, sans-serif;
  animation: falling linear forwards;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  width: auto;
  text-align: center;
}

@keyframes falling {
  0% {
    transform: translateY(-100vh);
    opacity: 0;
    rotate: 0deg;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translateY(105vh);
    opacity: 1;
    rotate: var(--final-rotation);
  }
}
</style>
