export default {
  generateToken(user) {
    const header = {
      alg: "HS256",
      typ: "JWT",
    };

    const payload = {
      sub: user.id,
      username: user.username,
      exp: Date.now() + 3600000,
    };

    const stringifiedHeader = btoa(JSON.stringify(header));
    const stringifiedPayload = btoa(JSON.stringify(payload));

    return `${stringifiedHeader}.${stringifiedPayload}.mocksignature`;
  },

  validateToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp > Date.now();
    } catch (e) {
      return false;
    }
  },

  login(username, password) {
    // 실제로는 서버 인증이 필요하지만, 프론트엔드에서 간단히 처리
    // 예시: 비밀번호가 최소 4자 이상인지 확인
    if (!password || password.length < 4) {
      throw new Error("비밀번호는 4자 이상이어야 합니다.");
    }

    const user = {
      id: Date.now().toString(),
      username,
      // 실제 환경에서는 절대 비밀번호를 저장하면 안됨
      // 여기서는 로그인 검증용으로만 사용
      hashedPassword: btoa(password), // 간단한 인코딩 (실제로는 더 강력한 해싱 필요)
    };

    const token = this.generateToken(user);
    localStorage.setItem("token", token);
    console.log("token : ", token);

    // 저장할 때는 비밀번호 정보 제외
    const userForStorage = {
      id: user.id,
      username: user.username,
    };
    localStorage.setItem("user", JSON.stringify(userForStorage));

    return userForStorage;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  checkAuth() {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData && this.validateToken(token)) {
      return JSON.parse(userData);
    }
    return null;
  },
};
