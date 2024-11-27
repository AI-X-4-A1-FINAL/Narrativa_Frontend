

const AuthGuard = async (userId: number) => {
  console.log('userId: ', userId);
  console.log('server url: ', process.env.REACT_APP_SPRING_URI);
  try {
    const response = await fetch(`${process.env.REACT_APP_SPRING_URI}/api/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // 쿠키를 포함하여 요청 전송
    });
    console.log('response url: ', response);
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (err: any) {
    return false;
  }
}
  

export default AuthGuard;