

const rest_api_key = '950412866395-khirauo8atsd8blnfs9a4vstj5srj94r.apps.googleusercontent.com'
const redirect_uri = 'http://localhost:8080/login/google'
const auth_code_path = 'https://accounts.google.com/o/oauth2/v2/auth'

export const getGoogleLoginLink = (): string => {
    const googleURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code&scope=email profile`;

    return googleURL;
}