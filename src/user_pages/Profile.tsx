import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "boring-avatars";

const Profile: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isEditingIntro, setIsEditingIntro] = useState(false);

  const [nickname, setNickname] = useState<string>(""); // 닉네임 초기 상태 비우기
  const [intro, setIntro] = useState<string>("hi good to see you");
  const [email, setEmail] = useState<string>(""); // 이메일 초기 상태 비우기

  const randomName = React.useMemo(
    () => Math.random().toString(36).substring(2, 10),
    []
  );

  // 데이터베이스에서 닉네임과 이메일 가져오기
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/user/profile"); // 프로필 데이터 API 호출
        if (!response.ok) throw new Error("Failed to fetch profile data.");
        const data = await response.json();
        setNickname(data.nickname); // 닉네임 업데이트
        setEmail(data.email); // 이메일 업데이트
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    };

    fetchProfileData();
  }, []);

  // 수정 완료 버튼 클릭 시 데이터베이스에 저장
  const handleSave = async () => {
    try {
      const profileData = {
        nickname,
        intro,
        avatar: randomName, // 프로필 이미지 키
      };

      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData), // 수정된 데이터 전송
      });

      if (!response.ok) throw new Error("Failed to save profile.");
      alert("프로필이 성공적으로 저장되었습니다.");
      setIsEditMode(false); // 수정 모드 종료
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        alert("프로필 저장 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto pt-4 text-black">
      <div className="relative">
        <div className="w-48 h-48 border-1 border-gray-200 rounded-full overflow-hidden">
          <Avatar
            size={190}
            name={randomName}
            variant="beam"
            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
          />
        </div>
        {isEditMode && (
          <button
            className="absolute bottom-2 right-6 px-10 py-2 rounded-full z-10"
            onClick={() => alert("프로필 이미지 수정 기능")}
          >
            <img
              src="/images/edit_camera.png"
              alt="Edit Nickname"
              className="w-8 h-8 mr-4"
            />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center relative">
        <h1 className="text-2xl mb-4 font-bold" title="Nickname">
          {isEditingNickname ? (
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onBlur={() => setIsEditingNickname(false)}
              className="text-2xl font-bold text-center w-auto px-1 border border-gray-300 rounded-md"
              style={{
                width: `${nickname.length + 3}ch`,
              }}
            />
          ) : (
            nickname || "로딩 중.."
          )}

          {isEditMode && !isEditingNickname && (
            <button
              onClick={() => setIsEditingNickname(true)}
              className="absolute -right-6 top-1 text-lg ml-2"
            >
              <img
                src="/images/edit_pen.png"
                alt="Edit Nickname"
                className="w-6 h-6"
              />
            </button>
          )}
        </h1>

        {isEditingIntro ? (
          <input
            type="text"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            onBlur={() => setIsEditingIntro(false)}
            className="text-sm text-center w-auto px-1 border border-gray-300 rounded-md"
            style={{
              width: `${intro.length + 3}ch`,
            }}
          />
        ) : (
          <p className="text-sm mb-2 relative" title="Message">
            {intro}
            {isEditMode && (
              <button
                onClick={() => setIsEditingIntro(true)}
                className="absolute -right-6 top-1 text-lg ml-2"
              >
                <img
                  src="/images/edit_pen.png"
                  alt="Edit Nickname"
                  className="w-6 h-6"
                />
              </button>
            )}
          </p>
        )}

        {/* 이메일 표시 */}
        <p className="text-gray-600 text-sm">{email || "로딩 중..."}</p>
      </div>

      <div>
        <img
          src="/images/line.png"
          alt="Profile"
          className="w-80 h-full object-cover mb-12 mt-10"
        />
      </div>

      <div className="flex space-x-4">
        <button
          onClick={isEditMode ? handleSave : () => setIsEditMode(true)}
          className="px-10 py-2 text-white border border-gray-300 rounded mb-4 bg-custom-purple hover:bg-blue-900"
        >
          {isEditMode ? "수정 완료" : "회원 수정"}
        </button>
      </div>
      <div className="flex space-x-4">
        <button className="px-10 py-2 text-white border border-gray-300 rounded mb-4 bg-custom-purple hover:bg-blue-900">
          설정 관리
        </button>
      </div>

      <div className="flex space-x-4">
        <button className="px-10 py-2 text-white border border-gray-300 rounded mb-20 bg-custom-purple hover:bg-blue-900">
          고객 센터
        </button>
      </div>

      <div className="text-sm text-gray-500 space-x-2 pt-1 mb-12">
        <Link to="/delete-account" className="hover:underline">
          회원탈퇴
        </Link>
        <span>|</span>
        <Link to="/logout" className="hover:underline">
          로그아웃
        </Link>
      </div>
    </div>
  );
};

export default Profile;