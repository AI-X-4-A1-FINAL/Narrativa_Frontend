import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "boring-avatars";
import { useCookies } from "react-cookie";
import axiosBaseURL from "../api/axios";
import AuthGuard from "../api/accessControl";
import { useDarkMode } from "../Contexts/DarkModeContext";
import { useNotification } from "../Contexts/NotificationContext";

interface UserProfileInfo {
  username: string;
  profile_url: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate(); // navigate 훅을 사용하여 리디렉션

  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);

  const [nickname, setNickname] = useState<string>(""); // 닉네임 초기 상태 비우기
  const [profileUrl, setProfileUrl] = useState<string>(""); // profile url

  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isBackgroundMusicOn, setIsBackgroundMusicOn] = useState(false);
  const { isNotificationsOn, toggleNotifications } = useNotification();
  console.log("Profile - isNotificationsOn:", isNotificationsOn);

  const [cookies, setCookie, removeCookie] = useCookies(["id"]);
  const [userId, setUserId] = useState(-1);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [img, setImg] = useState<File | null>(null); // 이미지
  const [isUploading, setIsUploading] = useState(false); // 업로드 상태
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 미리보기 이미지 상태

  const handleToggle = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter((prev) => !prev);
  };

  const randomName = React.useMemo(
    () => Math.random().toString(36).substring(2, 10),
    []
  );

  const fetchUserData = async (userId: number) => {
    try {
      // 백엔드 API 호출
      const response = await fetch(
        `${process.env.REACT_APP_SPRING_URI}/api/users/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch profile data.");
      let data = await response.json();
      console.log("Fetched User Data: ", data);
      console.log("Fetched User Data type: ", typeof data);

      const tmp_nickname = data.nickname;
      const tmp_profileUrl = data.profile_url;

      // 만약 data가 JSON 문자열이라면, 파싱을 시도
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      console.log("data.username: ", tmp_nickname);
      // console.log("data.profile_url: ", tmp_profileUrl);

      // 상태에 사용자 데이터 저장
      setNickname(tmp_nickname);
      setProfileUrl(tmp_profileUrl);

      console.log("nickname: ", nickname);
      // console.log("profile_url: ", profileUrl);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        setError("Failed to load user data.");
      }
    }
  };

  // 유저 유효성 검증
  const checkAuth = async (userId: number) => {
    const isAuthenticated = await AuthGuard(userId);
    if (!isAuthenticated) {
      navigate("/");
    }
  };

  // 데이터베이스에서 닉네임 가져오기
  useEffect(() => {
    console.log("cookies.id", cookies.id);
    if (cookies.id === undefined || cookies.id === null) {
      navigate("/");
    } else if (Number(cookies.id) !== -1) {
      // 'id' 쿠키 값 가져오기
      setUserId(cookies.id);
      fetchUserData(cookies.id);
    }
    setIsEditingNickname(false);

    if (!checkAuth(cookies.id)) {
      navigate("/"); // 유저 상태코드 유효하지 않으면 접근 불가 설정
    }
  }, []);

  console.log("userId: ", userId);
  // console.log('userData: ', userData);

  // 수정 완료 버튼 클릭 시 데이터베이스에 저장
  const handleSave = async () => {
    console.log('img', img);

    const profileImgData = {
      image: profileUrl
    };

    try {
      if (!img) {
        alert("이미지를 선택해주세요.");
        return;
      }

      const formData = new FormData();
      formData.append("image", img);

      // s3에 이미지 저장
      const saveImgToS3 = await fetch(
        `${process.env.REACT_APP_SPRING_URI}/api/s3/images/upload`,
        {
          method: "POST",
          body: formData, // 수정된 데이터 전송
        }
      );

      if(!saveImgToS3.ok) throw new Error("s3 이미지 업로드 실패");

      // s3 저장 후 img url 얻음(해당 url 클릭시 이미지 조회 불가 -> 다음 단계에서 얻는 url 이용시 이미지 조회)
      const text = await saveImgToS3.text();
      const data = JSON.parse(text);

      const imageUrlValue = data.imageUrl;
      console.log('imageUrlValue: ', imageUrlValue);

      const extractFilePath = (url: string): string => {
        const parsedUrl = new URL(url); // URL 객체로 파싱
        const path = parsedUrl.pathname; // 경로 부분 추출 ("/test/wfle.jpg")
        
        return path.substring(1); // "/"를 제외한 경로 부분만 반환
      };

      const extractS3FilePath = extractFilePath(imageUrlValue);
      console.log('extract path: ', extractS3FilePath);

      // s3에 이미지 저장
      const fetchPresignedUrl = await fetch(
        `${process.env.REACT_APP_SPRING_URI}/api/s3/image?filePath=${encodeURIComponent(extractS3FilePath)}`
      );
      
      if(!fetchPresignedUrl.ok) throw new Error("s3 PresignedUrl 요청 실패");

      const presignedUrlText = await fetchPresignedUrl.text();
      console.log('presignedUrlText', presignedUrlText);

      setProfileUrl(presignedUrlText);

      const profileData = {
        nickname,
        profile_url: presignedUrlText, // 프로필 이미지 키
      };

      // 닉네임, 프로필 url 저장
      const response = await fetch(
        `${process.env.REACT_APP_SPRING_URI}/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData), // 수정된 데이터 전송
        }
      );

      console.log("nickname: " + profileData.nickname);
      // console.log('profile_url: ' + profileData.profile_url);
      if (!response.ok) throw new Error("닉네임, 프로필 url 저장 실패");
      alert("프로필이 성공적으로 저장되었습니다.");
      setIsEditMode(false); // 수정 모드 종료

    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        alert("프로필 저장 중 오류가 발생했습니다.");
      }
    }
  };

  const deactivateAccount = async () => {
    // 회원 탈퇴 요청 함수
    setIsLoading(true);
    setError(null);

    try {
      console.log("cookies.id: ", cookies.id);
      const response = await axiosBaseURL.put(
        `/api/users/${userId}/deactivate`
      );
      console.log("Account Deactivated:", response.data);

      removeCookie("id"); // userId를 사용하지 않고 id라는 key로 쿠키를 삭제
      console.log("쿠키가 삭제되었습니다.");

      // 탈퇴 성공 후 alert 창 띄우기
      alert("회원 탈퇴가 완료되었습니다.");

      // 메인 화면으로 리디렉션
      navigate("/");
    } catch (error) {
      console.error("Error deactivating account:", error);
      setError("회원 탈퇴에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 쿠키 삭제 함수
  const handleRemoveCookie = () => {
    if (userId !== null) {
      // userId를 문자열로 변환하여 removeCookie에 전달
      removeCookie("id"); // userId를 사용하지 않고 id라는 key로 쿠키를 삭제
      console.log("쿠키가 삭제되었습니다.");

      // 탈퇴 성공 후 alert 창 띄우기
      alert("로그 아웃이 완료되었습니다.");

      // 메인 화면으로 리디렉션
      navigate("/");
    }
  };

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImg(file);
      convertToBase64(file);

      // 이미지 미리보기 URL 생성
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // 파일 업로드 함수
  const handleFileUpload = async () => {
    if (!img) {
      setError("파일을 선택해주세요.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", img);
  };

  // 파일을 Base64로 변환
  const convertToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Base64로 변환된 이미지 URL을 상태에 저장
      if (reader.result) {
        setProfileUrl(reader.result as string); // Base64 문자열로 저장
      }
    };
    reader.readAsDataURL(file); // 파일을 Base64 형식으로 읽음
  };

  useEffect(() => {
    console.log('profileUrl updated: ', profileUrl);
  }, [profileUrl])


  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto pt-4 text-black">
      <div className="relative">
        <div className="w-48 h-48 border-1 border-gray-200 rounded-full overflow-hidden">
          {/* previewUrl 1순위, profileUrl 2순위, 기본 Avatar 컴포넌트 3순위 */}
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : profileUrl ? (
            <img
              src={profileUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <Avatar
              size={190}
              name={randomName}
              variant="beam"
              colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
            />
          )}

        </div>
        {/* isEditMode가 true일 때만 파일 업로드 기능 표시 */}
        {isEditMode && (
          <>
            {/* 이미지 클릭 시 파일 선택 */}
            <button
              className="w-48 grid place-items-center"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <img
                src="/images/edit_camera.png"
                alt="Edit Nickname"
                className="w-8 h-8 grid place-items-center"
              />
            </button>

            {/* 숨겨진 input[type="file"] */}
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }} // input을 숨기기
              onChange={handleFileChange} // 파일이 선택되면 이 함수 호출
            />
          </>
        )}
      </div>

      <div className="flex flex-col items-center relative dark:text-white">
        <h1 className="text-2xl mb-4 font-bold" title="Nickname">
          {isEditingNickname ? (
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onBlur={() => setIsEditingNickname(false)}
              className="text-2xl font-bold text-center w-auto px-1 border border-gray-300 rounded-md dark:text-black"
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
                className="w-6 h-6 dark:invert"
              />
            </button>
          )}
        </h1>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={isEditMode ? handleSave : () => setIsEditMode(true)}
          className={`px-10 py-2 text-white border border-gray-300 rounded mt-4 mb-4 bg-custom-violet hover:bg-blue-900 dark:text-white ${
            isEditMode ? "dark:text-black" : "dark:text-black"
          }`}
        >
          {isEditMode ? "수정 완료" : "회원 수정"}
        </button>
      </div>

      <div className="space-y-4">
        <label className="flex items-center cursor-pointer px-10 py-4 text-black border border-gray-200 rounded mt-12 dark:text-white dark:border-opacity-10">
          <span className="mr-48">다크모드</span>
          <div
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
              isDarkMode ? "bg-custom-violet" : "bg-gray-300"
            }`}
            onClick={toggleDarkMode} // 전역 토글 함수 호출
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                isDarkMode ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </label>

        <label className="flex items-center cursor-pointer px-10 py-4 text-black border border-gray-200 rounded mt-4 dark:text-white dark:border-opacity-10">
          <span className="mr-48">배경음악</span>
          <div
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
              isBackgroundMusicOn ? "bg-custom-violet" : "bg-gray-300"
            }`}
            onClick={() => handleToggle(setIsBackgroundMusicOn)}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                isBackgroundMusicOn ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </label>

        <label className="flex items-center cursor-pointer px-10 py-4 text-black border border-gray-200 rounded mt-4 dark:text-white dark:border-opacity-10">
          <span className="mr-48">공지사항</span>
          <div
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
              isNotificationsOn ? "bg-custom-violet" : "bg-gray-300"
            }`}
            onClick={toggleNotifications}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                isNotificationsOn ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </label>
      </div>

      <div className="text-sm text-gray-500 space-x-2 pt-1 mb-12 mt-24">
        {/* 탈퇴 요청 버튼 */}
        <button
          onClick={deactivateAccount}
          disabled={isLoading}
          className="hover:underline"
        >
          {isLoading ? "탈퇴 중..." : "회원탈퇴 |"}
        </button>
        {error && <div style={{ color: "red" }}>{error}</div>}

        {/* 로그 아웃 버튼 */}
        <button onClick={handleRemoveCookie}>| 로그아웃</button>
      </div>
    </div>
  );
};

export default Profile;
