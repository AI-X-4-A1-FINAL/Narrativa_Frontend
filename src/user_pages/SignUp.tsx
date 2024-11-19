import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "boring-avatars";
import axios from "axios";

// 회원 가입시 필요한 데이터
interface SignUpData {
  username: string;
  email: string;
  profile_url: string | null;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(
    Math.random().toString(36).substring(2, 10) // 초기 랜덤 닉네임 생성
  );
  const [isEditing, setIsEditing] = useState(false); // 닉네임 편집 상태
  const [email, setEmail] = useState("abc123@narrativa.com"); // 초기 이메일
  const [message, setMessage] = useState<string | null>(null); // 이메일 유효성 메시지
  const [signupMessage, setSignupMessage] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null); // 이메일 유효성 상태
  const [profileUrl, setProfileUrl] = useState<string | null>(null);

  const [signupError, setSignupError] = useState<string>('');
  const [signupSuccess, setSignupSuccess] = useState<string>('');

  useEffect(() => {
    // URL에서 쿼리 파라미터 추출
    // eslint-disable-next-line no-restricted-globals
    const params = new URLSearchParams(location.search);
    const username = params.get('username');
    const profileUrl = params.get('profile_url');

    // 추출한 값 저장
    if (username && profileUrl) {
      setNickname(username);
      setProfileUrl(profileUrl);
    }
    
  }, []);

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
    // setIsValid(null); // 상태 초기화
    setIsValid(false); // 상태 초기화
  };

  // 이메일 형식 정규식
  const validateEmail = (email: string) => {
    // 간단한 이메일 정규식 예시
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  // 이메일 중복 확인 함수
  const checkEmailAvailability = async (email: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SPRING_URI}/api/users/check-email?email=${email}`, {
        method: 'post'  
      });
      //const data = await response.json();
      console.log('response.status: ', response.status);
      
      if (!validateEmail(email)) {
        setIsValid(false);
        setMessage("이메일 형식이 올바르지 않습니다.");
      } else if (response.ok) {
        setIsValid(true);
        setMessage("사용 가능한 이메일입니다.");
      } else if (response.status === 409){
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

  // 회원가입시 회원가입 정보 확인하여, 이메일 유효o => 회원가입 가능
  const handleConfirmClick = async () => {

    // 요청 본문에 들어갈 데이터
    const signUpData: SignUpData = {
      username: nickname,
      email: email,
      profile_url: profileUrl,
    };

    if (isValid) {
      try {
        // BE에 axios 요청해서 회원가입
        const response = await axios.post(
          `${process.env.REACT_APP_SPRING_URI}/api/users/sign-up`,
          signUpData,
          {
            headers: {
              'Content-Type': 'application/json', // 헤더에서 JSON 형식으로 보내도록 설정
            },
          }
        );
        // 201 리턴시만 home으로 이동
        if (response.status === 201) {
          navigate("/home");
        }  
      } catch (error: any) {
        if (error.response) {
          setSignupError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
          setSignupSuccess('');
        } else {
          setSignupError('네트워크 오류가 발생했습니다.');
          setSignupSuccess('');
        }
      
      } 
    } else {
      setSignupMessage('회원가입 정보를 확인해 주세요.');
    }
    console.log('signupError: ', signupError)
    console.log('signupSuccess: ', signupSuccess)
  }

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto pt-4 text-black">
      {/* 아바타 및 닉네임 */}
      <div className="relative flex flex-col items-center">
        {/* profileUrl이 존재하면 이미지, 없으면 기본 Avatar 컴포넌트를 사용 */}
        {profileUrl ? (
          <img
            src={profileUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <Avatar
            size={190}
            name={nickname}
            variant="beam"
            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
          />
        )}
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
          onClick={handleConfirmClick}
        >
          확인
        </button>
      </div>
      
      {/* 에러 메시지 */}
      {signupMessage && (
        <div className="text-red-500 mt-2">
          {signupMessage}
        </div>
      )}
      {/* socialLoginResult 정보 표시 */}
      {/*<div>
        <h1>Sign Up</h1>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Profile Image:</strong> {profileUrl} </p>
      </div>*/}
    </div>
  );
};

export default SignUp;
