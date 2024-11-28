const AuthGuard = async (userId: number) => {
  // console.log('userId: ', userId);
  // console.log('server url: ', process.env.REACT_APP_SPRING_URI);

  if (userId === undefined) {
    console.log("유저 아이디 타입이 undefined 입니다.");
    return false;
  }

  try {
    // 기존 쿠키 코드
    // const response = await fetch(`${process.env.REACT_APP_SPRING_URI}/api/users/${userId}`);

    const response = await fetch(
      `${process.env.REACT_APP_SPRING_URI}/api/users/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키를 포함하여 요청 전송
      }
    );
    // console.log('response url: ', response);
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (err: any) {
    return false;
  }
};

export default AuthGuard;
