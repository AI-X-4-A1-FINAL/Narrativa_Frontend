![NARRATIVA-TITLE](https://github.com/user-attachments/assets/97538156-f202-4b48-8543-9bbf835fda0e)

# Narrativa Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)

## 🗝️ 프로젝트 소개

`Narrativa_Frontend`는 AI 기반 스토리 생성 플랫폼인 Narrativa 프로젝트의 프론트엔드 모듈입니다.<br />
이 프로젝트는 사용자 입력을 기반으로 스토리를 생성하고 직관적인 UX/UI를 제공합니다.<br />
`React`, `Typescript`, `TailwindCSS` 등을 활용하여 유저친화적인 인터페이스와 효율적인 웹 애플리케이션을 개발합니다. <br />

## 🗝️ 설치 가이드

Narrativa_Frontend 프로젝트를 로컬 환경에서 클론하고, 빌드 및 실행하는 방법을 설명합니다.



### 1. 프로젝트 클론


### 2. 빌드 및 설치

### 3. 환경 설정

### 4. 실행

## 🗝️ 브랜치 관리 규칙

### 브랜치 구조
1. **메인 브랜치 (main)**
    - 프로덕션 배포용 안정 브랜치
    - PR을 통해서만 병합 가능

2. **개발 브랜치 (dev)**
    - 개발 중인 기능 통합 브랜치
    - 배포 전 최종 테스트 진행

3. **기능 브랜치 (feat/)**
    - 새로운 기능 개발용
    - 명명규칙: `feat/{기능명}`
    - 예: `feat/social-login`

4. **긴급 수정 브랜치 (hotfix/)**
    - 프로덕션 긴급 버그 수정용
    - 명명규칙: `hotfix/{이슈번호}`
    - 예: `hotfix/critical-bug`

### 브랜치 사용 예시
```bash
# 기능 브랜치 생성
git checkout -b feat/social-login

# 긴급 수정 브랜치 생성
git checkout -b hotfix/critical-bug
```

## 🗝️ 디렉토리 구조

```
Narrativa_Backend/
├── .github/
│   └── workflows/          # CI/CD 설정
├── config/                 # 서브모듈 설정
├── src/
│   └── main/
│       └── java/com/nova/narrativa/
│           ├── common/     # 공통 모듈
│           └── domain/     # 도메인별 모듈
│               ├── admin/
│               ├── game/
│               ├── llm/
│               ├── notice/
│               ├── tti/
│               ├── ttm/
│               └── user/
└── resources/
```

## 🗝️ 팀 정보

### **Part Leader**
  <br />
  <img src="https://github.com/user-attachments/assets/6e4a6035-db22-414a-b051-b59fd646d9cd" 
       alt="hs" 
       width="200" 
       height="auto" 
       style="max-width: 100%; height: auto;">
  <br />

### **Team Member**
<a href="https://github.com/shaneee123" target="_blank">
  <img src="https://github.com/user-attachments/assets/6ec7ec21-a9b1-4ebe-932f-c78064dcabe7" 
       alt="se" 
       width="200" 
       height="auto" 
       style="max-width: 100%; height: auto;">
</a>
<a href="https://github.com/Yesssung" target="_blank">
  <img src="https://github.com/user-attachments/assets/2ce88918-3e99-4dba-97c1-ef54d0cd4d48" 
       alt="ys" 
       width="200" 
       height="auto" 
       style="max-width: 100%; height: auto;">
</a>

## 🗝️ 문의 및 기여

프로젝트에 대한 문의사항이나 개선 제안은 이슈 탭에 등록해주세요.<br />
기여를 원하시는 분은 Fork & Pull Request를 통해 참여해주시면 감사하겠습니다.


<br /><br />
![footer](https://github.com/user-attachments/assets/c30abbd9-8e89-4a4e-8823-33fe0cf843c9)
