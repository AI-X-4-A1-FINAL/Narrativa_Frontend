

const client_id = 'Ov23li2bYuYiLoPuqAXO'
const auth_code_path = 'https://github.com/login/oauth/authorize'

export const getGithubLoginLink = (): string => {
    // const githubURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}`;
    const githubURL = `${auth_code_path}?client_id=${client_id}`;

    return githubURL;
}