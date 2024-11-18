import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "boring-avatars";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(
    Math.random().toString(36).substring(2, 10) // 초기 랜덤 닉네임 생성
  );
  const [isEditing, setIsEditing] = useState(false); // 닉네임 편집 상태
  const [email, setEmail] = useState("abc123@narrativa.com"); // 초기 이메일
  const [message, setMessage] = useState<string | null>(null); // 이메일 유효성 메시지
  const [isValid, setIsValid] = useState<boolean | null>(null); // 이메일 유효성 상태

  // 닉네임 변경 처리
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  // 닉네임 입력 필드에서 포커스 벗어날 때 저장
  const handleNicknameBlur = () => {
    setIsEditing(false);
  };

  // 이메일 변경 처리
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setMessage(null); // 메시지 초기화
    setIsValid(null); // 상태 초기화
  };

  // 이메일 중복 확인 함수
  const checkEmailAvailability = async (email: string) => {
    try {
      const response = await fetch(`/api/check-email?email=${email}`);
      const data = await response.json();

      if (data.isAvailable) {
        setIsValid(true);
        setMessage("사용 가능한 이메일입니다.");
      } else {
        setIsValid(false);
        setMessage("이미 사용 중인 이메일입니다.");
      }
    } catch (error) {
      setIsValid(false);
      setMessage("이메일 확인 중 오류가 발생했습니다.");
    }
  };

  // 이메일 입력 필드에서 포커스 벗어날 때 확인
  const handleEmailBlur = () => {
    if (email) {
      checkEmailAvailability(email);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto pt-4 text-black">
      {/* 아바타 및 닉네임 */}
      <div className="relative flex flex-col items-center">
        <div className="w-48 h-48 rounded-full overflow-hidden mb-4 flex items-center justify-center">
          <Avatar
            size={190}
            name={nickname}
            variant="beam"
            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
          />
        </div>
        {isEditing ? (
          <input
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            onBlur={handleNicknameBlur} // 닉네임 저장
            autoFocus
            className="border p-2 rounded text-black text-center"
          />
        ) : (
          <h1
            className="text-3xl font-bold mb-2 cursor-pointer"
            onClick={() => setIsEditing(true)} // 닉네임 편집 모드로 전환
          >
            {nickname}
          </h1>
        )}
      </div>

      {/* 이메일 입력 및 유효성 검사 */}
      <div className="flex flex-col items-start">
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          className="p-2 rounded w-full text-center"
        />
        <div className="h-6 flex justify-center items-center">
          {message && (
            <p
              className={`mt-2 text-center ${
                isValid ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
      {/* 확인 버튼 */}
      <div className="flex space-x-4 mt-4">
        <button
          className="px-4 py-2 text-white bg-custom-purple rounded hover:bg-blue-900"
          onClick={() => navigate("/home")}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default SignUp;
