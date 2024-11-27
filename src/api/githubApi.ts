const client_id = process.env.REACT_APP_GITHUB_CLIENT_ID;
const auth_code_path = process.env.REACT_APP_GITHUB_AUTH_CODE_PATH;

export const getGithubLoginLink = (): string => {
    console.log('getGoogleLoginLink auth_code_path: ', auth_code_path);
    console.log('getGoogleLoginLink rest_api_key: ', client_id);
    const githubURL = `${auth_code_path}?client_id=${client_id}`;
    console.log('githubURL: ', githubURL);
    return githubURL;
}