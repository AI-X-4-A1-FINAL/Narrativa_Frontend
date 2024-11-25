import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import AuthGuard from "../api/accessControl";

interface Genre {
  name: string;
  tags: string[];
  image: string;
}

interface UserInfo {
  nickname: string;
  status: string;
  profile_url: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();

  // 쿠키 이름 배열을 전달하여 쿠키 값을 가져옵니다.
  // const [cookies, setCookie, removeCookie] = useCookies(['id']);
  const [cookieValue, setCookieValue] = useState<string | null>(null);

  // 회원 상태
  const [userState, setUserState] = useState<string | null>(null);

  // 유저 유효성 검증
  const checkAuth = async (userId: number) => {
    const isAuthenticated = await AuthGuard(userId);
    if (!isAuthenticated) {
      navigate('/');
    }
  };

  // user status 정보 얻음(서버에 get 요청으로)
  const getUserStatus = async (userId: number) => {
    try {
      // 백엔드 API 호출
      const response = await fetch(`${process.env.REACT_APP_SPRING_URI}/api/users/${userId}/status`);
      if (!response.ok) throw new Error("Failed to fetch profile data.");
      let data : UserInfo = await response.json();
      console.log("Fetched User Data: ", data);
      console.log("Fetched User Data type: ", typeof data);

      const userStatus = data.status;
      setUserState(userStatus);

    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    const cookieId = cookies.id;
    if (cookieId === undefined || cookieId === null) {
      // alert('sssssss');
      navigate('/');
    // 'id' 쿠키 값 가져오기
    } else if (cookieId) {
      setCookieValue(cookieId);
      getUserStatus(cookieId);
      if (!checkAuth(cookieId)) {
        navigate('/');  // 유저 상태코드 유효하지 않으면 접근
      }
    } else {
      setCookieValue(null);
    }

  }, [cookies, navigate]); // cookies가 변경될 때마다 실행

  // userState가 업데이트된 후에 실행되는 useEffect
  useEffect(() => {
    console.log('userState: ', userState);
    if (userState === 'INACTIVE') {
      navigate('/login');
    }
  }, [userState]); // userState 값이 변경될 때마다 실행



  console.log('cookieValue: ', cookieValue);

  // 장르 데이터 배열
  const genres: Genre[] = [
    {
      name: "Survival",
      tags: ["서바이벌", "살아남기"],
      image: "/images/survival.jpeg",
    },
    {
      name: "Romance",
      tags: ["사랑", "드라마"],
      image: "/images/romance.png",
    },
    {
      name: "Simulation",
      tags: ["시뮬레이션", "라이프"],
      image: "/images/simulation.png",
    },
    {
      name: "Mystery",
      tags: ["스릴러", "범죄"],
      image: "/images/detective.jpg",
    },
  ];

  // 장르 클릭 핸들러
  const handleClick = (genre: string, tags: string[], image: string) => {
    navigate("/game-intro", {
      state: {
        genre,
        tags,
        image,
      },
    });
  };  

  return (
    <div className="w-full text-black min-h-screen overflow-y-auto bg-gray-50 mt-2">
      <div className="flex flex-col items-center">
        {genres.map((genre) => (
          <div
            key={genre.name}
            className="w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-gray-50 shadow-lg mb-6 group"
          >
            <div
              className="relative cursor-pointer"
              onClick={() => handleClick(genre.name, genre.tags, genre.image)}
            >
              <img
                src={genre.image}
                alt={`${genre.name} Genre Cover`}
                className="w-full h-[400px] object-cover rounded-2xl"
              />
              {/* Overlay for larger screens: visible on hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-center p-4 opacity-100 group-hover:opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
                <div>
                  <h3 className="text-2xl font-bold">{genre.name}</h3>
                  <div className="mt-2">
                    {genre.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block text-sm font-semibold mr-2 px-2 py-1 rounded-full bg-gray-800 bg-opacity-60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
