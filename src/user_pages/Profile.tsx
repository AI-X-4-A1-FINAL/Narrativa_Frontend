import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// 닉네임 중복확인, 빈공간일떄 수정 안됨 로직 추가해야뎀 11/14
const Profile: React.FC = () => {
    // 전체 수정 모드 상태
    const [isEditMode, setIsEditMode] = useState(false);
    // 개별 항목 수정 상태
    const [isEditingNickname, setIsEditingNickname] = useState(false);
    const [isEditingIntro, setIsEditingIntro] = useState(false);

    const [nickname, setNickname] = useState("나비");
    const [intro, setIntro] = useState("hi good to see you");

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
        setIsEditingNickname(false); // 초기화
        setIsEditingIntro(false);    // 초기화
    };

    return (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto pt-4 text-black">
            <div className="relative mb-7">
                <div className="w-80 h-80 border-4 border-gray-300 rounded-full overflow-hidden">
                    <img src="/images/cat.jpg" alt="Profile" className="w-full h-full object-cover" />
                </div>
                {isEditMode && (
                    <button
                        className="absolute bottom-2 right-6 px-10 py-2 rounded-full z-10"
                        onClick={() => alert('프로필 이미지 수정 기능')}
                    >
                        📷
                    </button>
                )}
            </div>
            
            <div className="flex flex-col items-center relative">
                <h1 className="text-3xl mb-4 font-bold" title="Nickname">
                    {isEditingNickname ? (
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            onBlur={() => setIsEditingNickname(false)}
                            className="absolute left-11 bottom-5 text-4xl font-bold mb-3 p-1 "
                            size={nickname.length || 2}
                        />
                    ) : (
                        nickname
                    )}
                    
                    {isEditMode && !isEditingNickname && (
                        <button
                            onClick={() => setIsEditingNickname(true)}
                            className="absolute -right-6 top-1 text-lg ml-2"
                        >
                            🖋️
                        </button>
                    )}
                </h1>

                {isEditingIntro ? (
                    <input
                        type="text"
                        value={intro}
                        onChange={(e) => setIntro(e.target.value)}
                        onBlur={() => setIsEditingIntro(false)}
                        className="text-xl p-1 border-b-2 border-gray-300 mb-4"
                    />
                ) : (
                    <p className="text-xl mb-4 relative" title="Message">
                        {intro}
                        {isEditMode && (
                            <button
                                onClick={() => setIsEditingIntro(true)}
                                className="absolute -right-6 top-1 text-lg ml-2"
                            >
                                🖋️
                            </button>
                        )}
                    </p>
                )}
            </div>

            <div className="flex space-x-4">
                <button
                    onClick={toggleEditMode}
                    className="px-5 py-1 text-black border border-gray-400 rounded hover:bg-gray-100"
                >
                    {isEditMode ? "완료" : "수정"}
                </button>
            </div>

            <div className="text-sm text-gray-500 space-x-2 pt-1">
        <div className="flex flex-col items-center w-full p-16 max-w-lg mx-auto text-black">
            <div className="w-48 h-48 border-1 border-gray-200 rounded-full overflow-hidden">
            <img src="/images/cat.jpg" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl font-bold mb-4">나비</h1>
            <p className="text-sm mb-12">안녕하세요 저는 응 어쩔텔레비전 어쩔파트라슈크림붕어빵 먹고싶다</p>

            <div >
            <img src="/images/line.png" alt="Profile" className="w-full h-full object-cover mb-8" />
            </div>

            <div className="flex space-x-4">
                
                <button className="px-10 py-2 text-black border border-grey rounded mb-5">정보 수정</button>
            </div>

            <div className="flex space-x-4">
                
                <button className="px-10 py-2 text-black border border-grey rounded mb-4">설정 관리</button>
            </div>

            <div className="flex space-x-4">
                
                <button className="px-10 py-2 text-black border border-grey rounded mb-20">고객 센터</button>
            </div>



            <div className="text-sm text-gray-500 space-x-2 pt-1 mb-12">
                <Link to="/delete-account" className="hover:underline">회원탈퇴</Link>
                <span>|</span>
                <Link to="/logout" className="hover:underline">로그아웃</Link>
            </div>

        </div>
    );
};

export default Profile;
