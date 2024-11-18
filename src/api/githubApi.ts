export const getGithubLoginLink = (): string => {
    // 환경 변수 값 가져오기
    const { REACT_APP_GITHUB_CLIENT_ID, REACT_APP_GITHUB_AUTH_CODE_PATH } = process.env;

    // 환경 변수들이 제대로 설정되어 있는지 확인
    if (!REACT_APP_GITHUB_CLIENT_ID || !REACT_APP_GITHUB_AUTH_CODE_PATH) {
        throw new Error("GitHub 환경 변수 설정이 누락되었습니다.");
    }

    // URL 인코딩을 적용하여 안전하게 값을 처리합니다.
    const clientId = encodeURIComponent(REACT_APP_GITHUB_CLIENT_ID);
    const authCodePath = REACT_APP_GITHUB_AUTH_CODE_PATH;

    // GitHub 로그인 링크 생성
    const githubURL = `${authCodePath}?client_id=${clientId}`;

    return githubURL;
}
