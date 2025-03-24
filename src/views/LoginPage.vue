<template>
  <div class="login-container">
    <h1 class="login-title">Login Page</h1>
    <div class="login-form">
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
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    handleLogin() {
      // 로그인 로직 구현
      console.log("Login attempt:", this.username);
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

.login-button {
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

.login-button:hover {
  background-color: #003b7b;
}
</style>
