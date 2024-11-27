

const AuthGuard = async (userId: number) => {
  console.log('userId: ', userId);
  console.log('server url: ', process.env.REACT_APP_SPRING_URI);
  try {
    const response = await fetch(`${process.env.REACT_APP_SPRING_URI}/api/users/${userId}`);
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