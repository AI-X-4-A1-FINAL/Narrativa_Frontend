# 1. 빌드 단계
FROM node:18 AS build

WORKDIR /app

# package.json과 package-lock.json 복사 및 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 앱 소스 코드 복사 및 빌드
COPY . . 
RUN npm run build

# 2. 배포 단계
FROM node:18-alpine

# `serve` 설치 (정적 파일을 서빙하기 위한 라이브러리)
RUN npm install -g serve && npm cache clean --force

# 빌드된 파일 복사
COPY --from=build /app/build /app/build

# 포트 3010 노출
EXPOSE 3010

# `serve`로 정적 파일 서빙
CMD ["serve", "-s", "/app/build", "-l", "3010"]
