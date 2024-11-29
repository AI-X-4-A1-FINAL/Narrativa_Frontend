import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import AuthGuard from "../api/accessControl";
import axios from "../api/axiosInstance";

interface LocationState {
  genre: string;
  tags: string[];
  image: string;
  userInput: string;
  initialStory: string;
  previousUserInput: string;
}

interface Message {
  sender: "user" | "opponent";
  text: string;
}

const GamePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { genre, tags, image, initialStory, previousUserInput } =
    location.state as LocationState;

  const [allMessages, setAllMessages] = useState<{ [key: number]: Message[] }>(
    {}
  );
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [musicLoading, setMusicLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies(["id"]);
  const [inputCount, setInputCount] = useState<number>(0);
  const [bgImage, setBgImage] = useState<string>(
    image || "/images/game-start.jpeg"
  );
  const imageFetched = useRef(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const prevStageRef = useRef<number>(currentStage);

  const stages = [
    { content: "Welcome to Stage!" },
    { content: "Final Stage! Stage 1!" },
    { content: "You're now in Stage 2!" },
    { content: "Keep going! Stage 3!" },
    { content: "Almost there! Stage 4!" },
    { content: "Final Stage! Stage 5!" },
  ];

  // 이미지 받아오기
  const fetchBackgroundImage = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SPRING_URI}/api/images/random`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBgImage(data.imageUrl);
    } catch (error) {
      setBgImage("/images/pikachu.jpg");
    }
  };

  // ML에서 이미지 받아오기
  const fetchBackgroundImageML = async (script: string) => {
    try {

//       const apiUrl = "/api/images/generate-image";
//       const requestBody = { script };
//       const response = await axios.post(apiUrl, requestBody);
//       const decodedString = atob(response.data);
//       const parsedData = JSON.parse(decodedString);
//       const imageURL = parsedData.imageUrl;
//       setBgImage(imageURL);
//     } catch (error: any) {
//       console.error("Error in fetchBackgroundImageML:", error);
//       setBgImage("/images/pikachu.jpg");

      // 이미지 생성 API URL
      const apiUrl = '/api/images/generate-image';  // 실제 백엔드 API URL로 설정
  
       // 요청 본문에 JSON 형태로 데이터를 전달
      const requestBody = {
        prompt: script,  // 이미지 생성에 사용할 프롬프트
        size: '1024x1024',  // 이미지 크기 (기본값)
        n: 1,  // 생성할 이미지 개수 (기본값)
      };

    console.log(requestBody);

    // POST 요청을 보낼 때 JSON 형태로 requestBody를 본문에 담아 전송
    const response = await axios.post(apiUrl, requestBody)
    

      // 응답이 성공적일 경우 처리
    console.log("Image generated successfully:", response.data); //성공적으로 반환 받음

   
    const imageURL = response.data;

      console.log("Image URL:", imageURL);

      // 배경 이미지 상태 업데이트
      setBgImage(imageURL);
    } catch (error: any) {
      console.error("Error in fetchBackgroundImageML:", error);

    }

  };
 

  // 음악 API 호출
  const fetchMusic = async (stageGenre: string) => {
    setMusicLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SPRING_URI}/api/music/random?genre=${stageGenre}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMusicUrl(data.url);
    } catch (error) {
      setMusicUrl(null);
    } finally {
      setMusicLoading(false);
    }
  };

  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === "" || loading || inputDisabled) {
      const newMessage: Message = {
        sender: "opponent",
        text: "답을 입력해주세요",
      };
      setCurrentMessages((prev) => [...prev, newMessage]);
      setAllMessages((prev) => ({
        ...prev,
        [currentStage]: [...(prev[currentStage] || []), newMessage],
      }));
      return;
    }

    const userMessage: Message = { sender: "user", text: userInput };
    setCurrentMessages((prev) => [...prev, userMessage]);
    setAllMessages((prev) => ({
      ...prev,
      [currentStage]: [...(prev[currentStage] || []), userMessage],
    }));

    setUserInput(""); // 입력 초기화
    setInputCount((prev) => prev + 1); // 입력 횟수 증가


    if (inputCount + 1 >= 5) {
      setInputDisabled(true);
      const nextMessage: Message = {
        sender: "opponent",
        text: "다음 스테이지로 넘어가세요.",
      };
      setCurrentMessages((prev) => [...prev, nextMessage]);
      setAllMessages((prev) => ({
        ...prev,
        [currentStage]: [...(prev[currentStage] || []), nextMessage],
      }));

      // 스테이지를 넘어가는 로직 추가
      await fetchOpponentMessage(userInput); // 상대 메시지 받아오기
      // setTimeout(() => {
      //   goToNextStage(); // 5초 후 다음 스테이지로 이동
      // }, 5000); // 5초 후

    } else {
      await fetchOpponentMessage(userInput);
    }
  };

  const fetchOpponentMessage = async (userInput: string) => {
    setLoading(true);
    try {
      // 모든 대화 내용들을 리스트로 생성
      const conversationHistory =
        (allMessages[currentStage - 1] || []).length > 0
          ? (allMessages[currentStage - 1] || []).map(
              (msg: Message) => `${msg.sender}: ${msg.text}`
            )
          : [];

      // 요청 본문 작성
      const requestBody = {
        genre: genre || "",
        currentStage: currentStage > 0 ? currentStage : 1,
        initialStory: initialStory || "",
        userInput: userInput || "",
        previousUserInput: previousUserInput || "",
        conversationHistory: conversationHistory,
      };

      const response = await axios.post("/generate-story/chat", requestBody);

      // 응답 처리
      setResponses((prevResponses) => [...prevResponses, response.data]);


      if (response.data && response.data.story) {
        const newMessage: Message = {
          sender: "opponent",
          text: response.data.story,
        };
        setCurrentMessages((prev) => [...prev, newMessage]);
        setAllMessages((prev) => ({
          ...prev,
          [currentStage]: [...(prev[currentStage] || []), newMessage],
        }));
      }

    } catch (error: any) {
      console.error("Error in fetchOpponentMessage:", error); // 디버깅용 로그
      const errorMessage: Message = {
        sender: "opponent",
        text: "오류가 발생했습니다. 다시 시도해주세요.",
      };

      setCurrentMessages((prev) => [...prev, errorMessage]);
      setAllMessages((prev) => ({
        ...prev,
        [currentStage]: [...(prev[currentStage] || []), errorMessage],
      }));
    } finally {
      setLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const goToNextStage = () => {
    if (currentStage < stages.length - 1) {
      const newMessages = [...currentMessages];
      const lastMessage = newMessages[newMessages.length - 1];

      setAllMessages((prev) => ({
        ...prev,
        [currentStage]: newMessages,
        [currentStage + 1]: [lastMessage],
      }));

      setCurrentMessages([lastMessage]);
      setCurrentStage((prev) => prev + 1);
      setInputCount(0);
      setInputDisabled(false);
    }
  };

  const goToPreviousStage = () => {
    if (currentStage > 0) {
      const previousMessages = allMessages[currentStage - 1] || [];
      setCurrentMessages(previousMessages);
      setCurrentStage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const savedMessages = allMessages[currentStage] || [];
    setCurrentMessages(savedMessages);
  }, [currentStage, allMessages]);

  const checkAuth = async (userId: number) => {
    const isAuthenticated = await AuthGuard(userId);
    if (!isAuthenticated) {
      navigate("/");
    }
  };

  useEffect(() => {
    if (initialStory && currentStage === 0) {
      const initialMessage: Message = {
        sender: "opponent",
        text: initialStory,
      };
      setAllMessages((prev) => ({
        ...prev,
        [currentStage]: [initialMessage],
      }));
      setCurrentMessages([initialMessage]);
    }

//     fetchBackgroundImage();
//     fetchMusic(genre);

//     if (cookies.id) {
//       checkAuth(parseInt(cookies.id));
//     }

//     if (inputCount > 5) {
//       setInputDisabled(true);

  //game-intro에서 게임 시작할때 나오는 이미지 random으로 S3에서 가져오기
  useEffect(() => {
    if (!imageFetched.current) {
      fetchBackgroundImage();
      imageFetched.current = true; // 이미지가 이미 받아졌다고 표시
    }
  }, []); // 빈 배열로 첫 번째 렌더링에서만 실행되도록 설정

  // 채팅 5번 입력 후 배경 이미지를 새로 가져오기 위한 useEffect
  useEffect(() => {
    
      if (responses.length == 5) {
        // 각 story의 내용을 결합하고 불필요한 \n\n을 제거
          const combinedStory = responses.slice(0, 5)
          .map(response => response.story) // 각 story 추출
          .join(' ') // 공백을 기준으로 합침
          .replace(/\n{2,}/g, ' ') // \n\n 이상인 부분을 공백으로 대체
          .replace(/\d+\.\s?/g, '') // 숫자와 선택지 번호 제거 (예: "1. ", "2. ")
          .replace(/(\d+)(?=\.)/g, '') // 선택지 번호 뒤의 숫자도 제거

        // 최종적으로 하나의 story 객체 생성
        const script = JSON.stringify({ story: combinedStory }, null, 2);
        console.log(script);

        // background 이미지 처리 함수 호출
        fetchBackgroundImageML(script);
        setInputCount(0); // 입력 횟수 초기화
      }
      

  }, [inputCount, responses]); // inputCount가 변경될 때마다 실행 (5번 입력 후 새로운 이미지 요청

  useEffect(() => {
    // initialStory가 있을 때만 처리
    if (initialStory && currentStage === 0) {
      // 초기 스토리가 있을 경우, 바로 메시지 추가
      const initialMessage: Message = {
        sender: "opponent",
        text: initialStory,
      };

      setCurrentMessages([initialMessage]); // 첫 번째 스테이지 메시지로 추가
      setAllMessages((prev) => ({
        ...prev,
        [0]: [initialMessage], // 첫 번째 단계의 메시지로 저장
      }));
    }
  }, [initialStory, currentStage]); // currentStage도 의존성에 추가하여 스테이지가 변경될 때마다 확인

  useEffect(() => {
    // 유저 정보 x '/' redirect
    if (cookies.id === undefined || cookies.id === null) {
      navigate("/");
    }
    if (!checkAuth(cookies.id)) {
      navigate("/"); // 유저 인증 실패 시 접근 차단
    }

    // 최초 스테이지(0)에서 음악 가져오기
    if (genre && currentStage === 0 && !musicUrl) {
      fetchMusic(genre); // 음악 URL 초기화
    }

    if (
      genre &&
      currentStage > prevStageRef.current && // 이전 스테이지보다 클 때만
      currentStage < stages.length // 최대 스테이지 이하일 때
    ) {
      fetchMusic(genre); // 새로운 음악 가져오기
    }

    // 이전 스테이지 업데이트
    prevStageRef.current = currentStage;
  }, [currentStage, genre, cookies.id]);

  // 음악이 로드된 후 자동 재생
  useEffect(() => {
    if (audioRef.current && musicUrl) {
      // 음악이 로드되었을 때 자동 재생 시도
      audioRef.current.play().catch((error) => {
        console.error("Auto-play was prevented:", error);
      });
      setIsPlaying(true); // 재생 상태 업데이트
    }
  }, [musicUrl]);

  // 채팅 메시지가 추가될 때마다 자동으로 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentMessages]); // currentMessages가 변경될 때마다 실행

  // 채팅 메시지가 추가될 때마다 자동으로 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });

    }
  }, [currentStage, cookies.id]);

  return (
    <div className="relative w-full h-screen bg-gray-800 text-white">
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <img
          src={bgImage} // 동적으로 업데이트된 배경 이미지 사용
          alt={`Stage ${currentStage + 1}`}
          className="w-screen h-screen object-cover"
        />
      </div>

      {/* 음악 플레이어 */}
      <div className="absolute top-0 left-4">
        {musicLoading ? (
          <p className="text-white">Loading music...</p>
        ) : musicUrl ? (
          <div className="flex flex-col items-center">
            <audio ref={audioRef} src={musicUrl} />
            <button
              onClick={togglePlayPause}
              className="bg-gray-900 text-white font-bold py-2 px-4 mt-4 rounded-full hover:bg-custom-purple"
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
          </div>
        ) : (
          <p className="text-white">No music available</p>
        )}
      </div>

      {/* 뒤로가기 */}
      <div className="absolute top-0 right-4">
        <div className="flex flex-col items-center">
          <button
            onClick={() => {
              if (window.confirm("정말 나가시겠습니까?")) {
                navigate("/game-intro", {
                  state: {
                    genre,
                    tags,
                    image,
                  },
                });
              }
            }}
            className="bg-gray-900 text-white font-bold py-2 px-4 mt-4 rounded-full hover:bg-custom-purple"
          >
            ↻
          </button>
        </div>
      </div>

      {/* 채팅창 */}
      <div
        className={`absolute bottom-0 w-full bg-opacity-20 bg-custom-violet text-white ${
          isExpanded ? "h-[85%] bg-opacity-20 backdrop-blur-md" : "h-[20%]"
        } transition-all duration-300 ease-in-out flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex justify-between items-center border-b pb-4 p-4 cursor-pointer"
          onClick={toggleExpansion}
        >
          <h2 className="text-lg font-semibold">
            {isExpanded
              ? `스토리 진행 - 단계 ${currentStage + 1}`
              : "채팅창 열기"}
          </h2>
        </div>

        {/* 채팅 메시지 */}
        <div
          className={`overflow-y-auto flex-grow px-4 space-y-2 ${
            isExpanded ? "block" : "hidden"
          }`}
        >
          {currentMessages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 ${
                message.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <p
                className={`inline-block px-3 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-white text-black"
                    : "bg-custom-purple text-white"
                }`}
              >
                {message.text}
              </p>
            </div>
          ))}
          {/* 메시지 끝을 가리키는 요소 */}
          <div ref={messagesEndRef} />
        </div>

        {/* 메시지 입력창 */}
        {isExpanded && (
          <div className="p-4 bg-gray-900">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation();
                    handleSendMessage(); // 엔터키가 눌리면 메시지 전송
                  }
                }}
                className="border-2 border-gray-300 text-black rounded-l-lg py-2 px-3 w-full"
                placeholder="메시지를 입력하세요..."
                disabled={inputDisabled} // 입력 비활성화
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || inputDisabled} // 버튼 비활성화
                className={`bg-custom-violet text-white font-bold py-2 px-4 rounded-r-lg ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Next 버튼 */}
      {!isExpanded && (
        <button
          onClick={
            currentStage < stages.length - 1
              ? goToNextStage // 다음 단계로 이동
              : () => navigate("/game-ending") // 결말 페이지로 이동
          }
          className="absolute right-4 bottom-4 text-white font-bold py-2 px-4 rounded-full hover:bg-custom-violet"
        >
          {currentStage < stages.length - 1 ? "Next" : "Game"}
        </button>
      )}

      {/* Back 버튼 */}
      {!isExpanded && currentStage > 0 && (
        <button
          onClick={goToPreviousStage}
          className="absolute left-4 bottom-4  text-white font-bold py-2 px-4 rounded-full hover:bg-custom-violet"
        >
          Back
        </button>
      )}
    </div>
  );
};

export default GamePage;
