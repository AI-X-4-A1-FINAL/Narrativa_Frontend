const client_id = process.env.REACT_APP_GITHUB_CLIENT_ID
const auth_code_path = process.env.REACT_APP_GITHUB_AUTH_CODE_PATH

export const getGithubLoginLink = (): string => {
    const githubURL = `${auth_code_path}?client_id=${client_id}`;
    console.log('githubURL: ', githubURL);
    return githubURL;
}