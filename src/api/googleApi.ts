

export const getGoogleLoginLink = (): string => {
    // 환경 변수 값 가져오기
    const { REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_GOOGLE_AUTH_CODE_PATH, REACT_APP_URI, REACT_APP_GOOGLE_REDIRECT_URI_PART } = process.env;

    // 필수 값들이 존재하는지 확인
    if (!REACT_APP_GOOGLE_CLIENT_ID || !REACT_APP_GOOGLE_AUTH_CODE_PATH || !REACT_APP_URI || !REACT_APP_GOOGLE_REDIRECT_URI_PART) {
        throw new Error("환경 변수 설정이 누락되었습니다.");
    }

    // URL 생성
    const googleURL = `${REACT_APP_GOOGLE_AUTH_CODE_PATH}?client_id=${encodeURIComponent(REACT_APP_GOOGLE_CLIENT_ID)}&redirect_uri=${encodeURIComponent(REACT_APP_URI + REACT_APP_GOOGLE_REDIRECT_URI_PART)}&response_type=code&scope=email%20profile`;

    return googleURL;
}
