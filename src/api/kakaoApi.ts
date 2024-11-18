

const rest_api_key = 'e60d26b05f52eca2d3f547b087a8cb75'
const redirect_uri = 'http://localhost:8080/login/kakao'
const auth_code_path = 'https://kauth.kakao.com/oauth/authorize'

export const getKakaoLoginLink = (): string => {
    const kakaoURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

    return kakaoURL;
}