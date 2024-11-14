# 1단계: 빌드 이미지 생성
FROM node:16 AS build

# 작업 디렉토리 생성
WORKDIR /app

# 패키지 파일 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 파일 복사
COPY . .

# React 앱 빌드 (정적 파일 생성)
RUN npm run build

# 2단계: 프로덕션 서버 설정 (Nginx)
FROM nginx:alpine

# 빌드된 파일을 Nginx의 기본 경로에 복사
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 설정 복사 (필요 시 맞춤 설정 적용 가능)
COPY nginx.conf /etc/nginx/nginx.conf

# 컨테이너가 시작될 때 실행할 명령
CMD ["nginx", "-g", "daemon off;"]

# 컨테이너가 사용할 포트
EXPOSE 80
