import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "boring-avatars";

const Profile: React.FC = () => {
    // 전체 수정 모드 상태
    const [isEditMode, setIsEditMode] = useState(false);
    // 개별 항목 수정 상태
    const [isEditingNickname, setIsEditingNickname] = useState(false);
    const [isEditingIntro, setIsEditingIntro] = useState(false);

    const [nickname, setNickname] = useState("나비");
    const [intro, setIntro] = useState("hi good to see you");


    const [isdarkModeOn, setIsdarkModeOn] = useState(false);
    const [isBackgroundMusicOn, setIsBackgroundMusicOn] = useState(false);
    const [isNotificationsOn, setIsNotificationsOn] = useState(false);

    const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
        setter(prev => !prev);
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
        setIsEditingNickname(false); // 초기화
        setIsEditingIntro(false);    // 초기화
    };

    return (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto pt-4 text-black">
            <div className="relative">
                <div className="w-48 h-48 border-1 border-gray-200 rounded-full overflow-hidden">
                    <img src="/images/cat.jpg" alt="Profile" className="w-full h-full object-cover" />
                </div>
                {isEditMode && (
                    <button
                        className="absolute bottom-2 right-6 px-10 py-2 rounded-full z-10"
                        onClick={() => alert('프로필 이미지 수정 기능')}
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
                        width: `${nickname.length + 3}ch`, // 닉네임 길이에 맞는 너비 설정
                            }}
                    />
                    ) : (
                        nickname
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
                        width: `${intro.length + 3}ch`, // 닉네임 길이에 맞는 너비 설정
                            }}
                    />     
                ) : (
                    <p className="text-sm mb-4 relative" title="Message">
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
            </div>

            <div className="flex space-x-4">
                <button
                    onClick={toggleEditMode}
                    className="px-10 py-2 text-gray-200 bg-custom-violet border border-gray-300 rounded mt-4"
                >
                    {isEditMode ? "완료" : "수정"}
                </button>
            </div>

            <div >
            <img src="/images/line.png" alt="Profile" className="w-96 h-full object-cover mb-4 mt-6" />
            </div>

            <div className="space-y-4">
  <label className="flex items-center cursor-pointer px-10 py-4 text-black border border-gray-200 rounded mt-4 ">
    <span className="mr-48">다크모드</span>
    <div
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
        isdarkModeOn ? 'bg-custom-violet' : 'bg-gray-300'
      }`}
      onClick={() => handleToggle(setIsdarkModeOn)}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isdarkModeOn ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </div>
  </label>

  <label className="flex items-center cursor-pointer px-10 py-4 text-black border border-gray-200 rounded mt-4 ">
    <span className="mr-48">배경음악</span>
    <div
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
        isBackgroundMusicOn ? 'bg-custom-violet' : 'bg-gray-300'
      }`}
      onClick={() => handleToggle(setIsBackgroundMusicOn)}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isBackgroundMusicOn ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </div>
  </label>

  <label className="flex items-center cursor-pointer px-10 py-4 text-black border border-gray-200 rounded mt-4 ">
    <span className="mr-48">공지사항</span>
    <div
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
        isNotificationsOn ? 'bg-custom-violet' : 'bg-gray-300'
      }`}
      onClick={() => handleToggle(setIsNotificationsOn)}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isNotificationsOn ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </div>
  </label>
</div>




            <div className="text-sm text-gray-500 space-x-2 pt-1 mb-12 mt-24">
                <Link to="/delete-account" className="hover:underline">회원탈퇴</Link>
                <span>|</span>
                <Link to="/logout" className="hover:underline">로그아웃</Link>
            </div>

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
