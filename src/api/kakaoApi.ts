export const getKakaoLoginLink = (): string => {
    // 필요한 환경 변수 값을 가져옵니다.
    const { REACT_APP_KAKAO_CLIENT_ID, REACT_APP_KAKAO_AUTH_CODE_PATH, REACT_APP_SPRING_URI, REACT_APP_KAKAO_REDIRECT_URI_PART } = process.env;

    // 환경 변수들이 제대로 설정되어 있는지 확인
    if (!REACT_APP_KAKAO_CLIENT_ID || !REACT_APP_KAKAO_AUTH_CODE_PATH || !REACT_APP_SPRING_URI || !REACT_APP_KAKAO_REDIRECT_URI_PART) {
        throw new Error("환경 변수 설정이 누락되었습니다.");
    }

    // URL 인코딩을 적용하여 안전하게 값을 처리합니다.
    const clientId = encodeURIComponent(REACT_APP_KAKAO_CLIENT_ID);
    const redirectUri = encodeURIComponent(REACT_APP_SPRING_URI + REACT_APP_KAKAO_REDIRECT_URI_PART);

    // 카카오 로그인 링크를 생성
    const kakaoURL = `${REACT_APP_KAKAO_AUTH_CODE_PATH}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

    return kakaoURL;
}