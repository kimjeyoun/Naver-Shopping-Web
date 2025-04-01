<template>
  <div class="login-container">
    <h1 class="login-title">Login Page</h1>
    <div v-if="!isLoggedIn" class="login-form">
      <div class="form-group">
        <label>아이디</label>
        <input
          type="text"
          v-model="username"
          placeholder="아이디를 입력하세요"
        />
      </div>
      <div class="form-group">
        <label>패스워드</label>
        <input
          type="password"
          v-model="password"
          placeholder="비밀번호를 입력하세요"
        />
      </div>
      <button class="login-button" @click="handleLogin">Log in</button>
      <p v-if="error" class="error-message">{{ error }}</p>
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
    };
  },
  mounted() {
    this.checkLoginStatus();
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
        this.username = "";
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
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.login-title {
  color: #002b5b;
  margin-bottom: 2rem;
  font-size: 24px;
}

.login-form {
  width: 100%;
  max-width: 400px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.login-button,
.logout-button {
  width: 100%;
  padding: 12px;
  background-color: #002b5b;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 1rem;
}

.login-button:hover,
.logout-button:hover {
  background-color: #003b7b;
}

.error-message {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

.welcome-container {
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.welcome-container h2 {
  color: #002b5b;
  margin-bottom: 1rem;
}

.logout-button {
  background-color: #d32f2f;
}

.logout-button:hover {
  background-color: #b71c1c;
}
</style>
