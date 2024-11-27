const AuthGuard = async (Id: number) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_SPRING_URI}/api/users/${Id}`
    );
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (err: any) {
    return false;
  }
  // return true;
};

export default AuthGuard;
