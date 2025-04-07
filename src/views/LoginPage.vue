<template>
  <div class="login-container">
    <div class="login-card">
      <div class="profile-icon">
        <i class="fas fa-user"></i>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="help-tooltip">
          <span class="help-text">How to login?</span>
          <div class="tooltip-content">
            <p>이 사이트는 테스트용 로그인 시스템을 사용합니다.</p>
            <p>• 아이디와 비밀번호는 자유롭게 입력 가능</p>
            <p>• 회원정보는 저장되지 않음</p>
            <p>• 일회용 로그인으로 사용</p>
            <p>• 실제 사용자 확인을 위한 용도</p>
          </div>
        </div>
        <div class="form-group">
          <div class="input-with-icon">
            <i class="fas fa-user"></i>
            <input
              type="text"
              v-model="username"
              placeholder="ID"
              class="glass-input"
            />
          </div>
        </div>
        <div class="form-group">
          <div class="input-with-icon">
            <i class="fas fa-lock"></i>
            <input
              type="password"
              v-model="password"
              placeholder="Password"
              class="glass-input"
            />
          </div>
        </div>
        <div class="options-row">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" />
            <span>Remember me</span>
          </label>
        </div>
        <button type="submit" class="login-button">LOGIN</button>
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import auth from "@/auth";

export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
      error: "",
      rememberMe: false,
    };
  },
  mounted() {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      this.username = savedUsername;
      this.rememberMe = true;
    }
    // 이미 로그인된 상태라면 검색 페이지로 리다이렉트
    if (auth.checkAuth()) {
      this.$router.push("/search");
    }
  },
  methods: {
    handleLogin() {
      if (!this.username || !this.password) {
        this.error = "아이디와 비밀번호를 입력해주세요.";
        return;
      }

      try {
        const user = auth.login(this.username, this.password);

        if (this.rememberMe) {
          localStorage.setItem("rememberedUsername", this.username);
        } else {
          localStorage.removeItem("rememberedUsername");
        }

        this.password = "";

        // 로그인 성공 시 검색 페이지로 리다이렉트
        this.$router.push("/search");

        console.log("로그인 성공:", user.username);
      } catch (error) {
        this.error = "로그인에 실패했습니다.";
        console.error("로그인 에러:", error);
      }
    },
  },
  watch: {
    rememberMe(newValue) {
      if (!newValue) {
        localStorage.removeItem("rememberedUsername");
      } else if (this.username) {
        localStorage.setItem("rememberedUsername", this.username);
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  /* 더 다양한 색상의 그라데이션 */
  background: linear-gradient(
    135deg,
    #03c75a 0%,
    /* 네이버 초록 */ #02d362 20%,
    /* 밝은 초록 */ #00b894 40%,
    /* 청록색 계열 */ #02a347 60%,
    /* 기본 초록 */ #019454 80%,
    /* 깊은 초록 */ #017e47 100% /* 어두운 초록 */
  );
  /* 추가적인 레이어로 입체감과 광택 효과 */
  background-image: radial-gradient(
      circle at top left,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 50%
    ),
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.05) 25%,
      transparent 50%
    ),
    linear-gradient(
      135deg,
      #03c75a 0%,
      #02d362 20%,
      #00b894 40%,
      #02a347 60%,
      #019454 80%,
      #017e47 100%
    );
  padding: 20px;
  background-size: 200% 200%;
  animation: gradientAnimation 15s ease infinite;
  position: relative;
  overflow: hidden;
}

/* 움직이는 그라데이션 효과 */
@keyframes gradientAnimation {
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

/* 추가: 배경에 움직이는 원형 효과 */
.login-container::before {
  content: "";
  position: absolute;
  width: 150%;
  height: 150%;
  top: -25%;
  left: -25%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%
  );
  animation: circleAnimation 15s linear infinite;
}

@keyframes circleAnimation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.login-card {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  backdrop-filter: blur(10px);
  z-index: 1; /* 배경 효과 위에 표시되도록 */
}

.profile-icon {
  width: 80px;
  height: 80px;
  background: #03c75a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.login-form {
  margin-top: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon i {
  position: absolute;
  left: 12px;
  color: #666;
}

.glass-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  transition: all 0.3s ease;
}

.glass-input:focus {
  outline: none;
  border-color: #03c75a;
  box-shadow: 0 0 0 2px rgba(3, 199, 90, 0.2);
}

.options-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.forgot-password {
  color: #03c75a;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 12px;
  background: #03c75a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background: #02a347;
}

.error-message {
  color: #d32f2f;
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
}

.help-tooltip {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
  cursor: help;
}

.help-text {
  color: #03c75a;
  font-size: 14px;
  text-decoration: underline;
}

.tooltip-content {
  visibility: hidden;
  position: absolute;
  z-index: 1;
  width: 250px;
  background-color: white;
  color: #333;
  text-align: left;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
}

.help-tooltip:hover .tooltip-content {
  visibility: visible;
  opacity: 1;
}

.tooltip-content p {
  margin: 8px 0;
  font-size: 13px;
  line-height: 1.4;
}

.tooltip-content p:first-child {
  font-weight: bold;
  color: #03c75a;
  margin-bottom: 12px;
}
</style>
