<template>
  <div class="login-container">
    <div v-if="!isLoggedIn" class="login-card">
      <div class="profile-icon">
        <i class="fas fa-user"></i>
      </div>
      <div class="login-form">
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
        <button class="login-button" @click="handleLogin">LOGIN</button>
        <p v-if="error" class="error-message">{{ error }}</p>
      </div>
    </div>
    <div v-else class="welcome-container">
      <h2>환영합니다, {{ currentUser.username }}님!</h2>
      <button class="logout-button" @click="handleLogout">로그아웃</button>
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
      isLoggedIn: false,
      currentUser: null,
      error: "",
      rememberMe: false,
    };
  },
  mounted() {
    this.checkLoginStatus();
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      this.username = savedUsername;
      this.rememberMe = true;
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
        this.isLoggedIn = true;
        this.currentUser = user;
        this.error = "";

        if (this.rememberMe) {
          localStorage.setItem("rememberedUsername", this.username);
        } else {
          localStorage.removeItem("rememberedUsername");
        }

        this.password = "";

        console.log("로그인 성공:", this.currentUser.username);
      } catch (error) {
        this.error = "로그인에 실패했습니다.";
        console.error("로그인 에러:", error);
      }
    },

    handleLogout() {
      auth.logout();
      this.isLoggedIn = false;
      this.currentUser = null;
      if (!this.rememberMe) {
        this.username = "";
      }
      this.password = "";
      console.log("로그아웃 완료");
    },

    checkLoginStatus() {
      const user = auth.checkAuth();
      if (user) {
        this.currentUser = user;
        this.isLoggedIn = true;
      } else {
        this.handleLogout();
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

.welcome-container {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  z-index: 1;
}

.welcome-container h2 {
  color: #333;
  margin-bottom: 20px;
}

.logout-button {
  padding: 12px 24px;
  background: #03c75a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background: #02a347;
}
</style>
