# 네이버 쇼핑 웹 + 챗봇 서비스

## 📋 프로젝트 소개
네이버 쇼핑 웹 + 챗봇 서비스는 네이버 쇼핑 API를 활용한 상품 검색 서비스와 OpenAI API를 활용한 챗봇 서비스를 결합한 웹 애플리케이션입니다. 사용자는 상품을 검색하고, 챗봇과 대화하며 쇼핑 관련 정보를 얻을 수 있습니다.

## 🛠 기술 스택
- **Frontend**
  - Vue.js 3
  - Vue Router
  - Axios
  - Font Awesome

- **API**
  - Naver Shopping API
  - OpenAI API
 
## 🎥 주요 페이지 및 기능 시연

### 랜딩 페이지
https://github.com/user-attachments/assets/77581bab-3c28-4f05-b689-c875fdd7ebc3

![랜딩-페이지-스크롤](https://github.com/user-attachments/assets/294496d3-3e3e-4b41-b188-ff6f57bcebef)

- 동적인 배경 애니메이션
- 스크롤 기반 섹션 전환
- 부드러운 텍스트 등장 효과

### 로그인 페이지
<img src="https://github.com/user-attachments/assets/7efcda92-85eb-47e9-8b97-f329339ca151" width="500" height="300">
<img src="https://github.com/user-attachments/assets/bdbf6a8c-5400-4353-9418-aa9c9066ea4d" width="350" height="300">

- Remember me 기능
- 별도의 회원가입X
- 테스트를 위한 일회용 로그인

### 상품 검색 페이지
https://github.com/user-attachments/assets/9abe366a-cd55-4e5b-bb58-df10f51521b6

https://github.com/user-attachments/assets/99c738de-6945-492a-8000-41cba18aba61

- 실시간 상품 검색
- 정렬 필터 (정확도순/날짜순/가격순)
- 무한 스크롤 상품 목록
- 반응형 그리드 레이아웃

### 챗봇 페이지
<img src="https://github.com/user-attachments/assets/872342f0-5d9a-495d-b475-40582706628b" width="500" height="300">
<img src="https://github.com/user-attachments/assets/33381f01-3042-411f-81af-fca4cc2e805e" width="500" height="300">
<img src="https://github.com/user-attachments/assets/49171b7d-9952-4423-b982-8d59ac7d62f9" width="500" height="300">
<img src="https://github.com/user-attachments/assets/f24a95e1-859f-4bc2-a795-eb1ac823d166" width="500" height="300">
<img src="https://github.com/user-attachments/assets/8a6a8628-b574-45ca-a002-d836b2e84f69" width="500" height="300">

- 실시간 대화 인터페이스
- 라이트/다크 모드 전환
- 대화 목록 사이드바
- 자동 스크롤 및 로딩 애니메이션

## ✨ 주요 기능 및 특징

### 1. 상품 검색
- 실시간 상품 검색
- 정확도순/날짜순/가격순 정렬
- 무한 스크롤을 통한 상품 목록 로딩
- 상품 상세 정보 표시 (브랜드, 가격, 카테고리 등)

### 2. 챗봇 서비스
- 실시간 대화 기능
- 대화 목록 관리
- 대화 주제 자동 생성
- 라이트/다크 모드 지원
- 대화 내역 저장 및 불러오기

### 3. 사용자 인증
- 로그인/로그아웃 기능(테스트 유저 관리로 실제 유저 정보를 DB에 저장하지 않는 일회용 로그인/로그아웃)
- 아이디 기억 (Remember me)
- 사용자 정보 표시(id)

## 💫 UI/UX 특징
- 모던하고 직관적인 인터페이스
- 부드러운 애니메이션과 전환 효과
- 반응형 디자인으로 모바일 지원
- 다크 모드 지원으로 사용자 편의성 향상

## 🎨 디자인 시스템
- Atomic Design 방법론 적용
- 일관된 컴포넌트 스타일링
- 재사용 가능한 UI 컴포넌트
- 테마 변수를 통한 스타일 관리

## 🚀 시작하기

### 설치
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run serve

# 프로덕션 빌드
npm run build
```

### 환경 변수 설정
`.env` 파일을 생성하고 다음 변수들을 설정해주세요:
```
VUE_APP_OPENAI_API_KEY=your_openai_api_key
VUE_APP_NAVER_CLIENT_ID=your_naver_client_id
VUE_APP_NAVER_CLIENT_SECRET=your_naver_client_secret
```

## 📁 프로젝트 구조
```
src/
├── api/           # API 통신 관련 파일
├── assets/        # 정적 파일
├── components/    # Vue 컴포넌트
│   ├── atoms/     # 원자 컴포넌트
│   ├── molecules/ # 분자 컴포넌트
│   ├── organisms/ # 유기체 컴포넌트
│   └── templates/ # 템플 컴포넌트
├── router/        # 라우팅 설정
├── services/      # 서비스 로직
└── views/         # 페이지 컴포넌트
```

## 🔒 보안
- API 키는 환경 변수를 통해 관리
- 사용자 인증 정보는 localStorage에 암호화하여 저장
- API 요청 시 적절한 헤더와 인증 정보 포함
