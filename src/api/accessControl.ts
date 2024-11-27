// 쿠키에서 값 가져오는 함수
const getCookie = (cookieName: string): string | null => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === cookieName) return value;
  }
  return null;
};

// 사용자 인증 확인
const AuthGuard = async (userId: number) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_SPRING_URI}/api/users/${userId}`
    );
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (err: any) {
    console.error("AuthGuard error:", err);
    return false;
  }
};

// 예제 실행
const App = async () => {
  const userId = getCookie("id");
  if (userId) {
    const isAuthenticated = await AuthGuard(Number(userId));
    console.log("isAuthenticated:", isAuthenticated);
  } else {
    console.error("Failed to retrieve userId from cookies");
  }
};

export default App;
