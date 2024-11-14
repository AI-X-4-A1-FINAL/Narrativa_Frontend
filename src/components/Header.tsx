import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
    const location = useLocation();

    if (location.pathname === "/") {
        return null;
    }

    return (
        <header className="flex flex-col items-center w-full max-w-lg mx-auto p-4 text-black fixed top-0 bg-white z-10">
            {/* 상단 이미지 컨테이너 */}
            <div className="flex justify-between items-center w-full">
                <Link to="/home" className='self-end'>
                    <img src="/images/Group 18317.png" alt="Bookmarks" className="h-16 mt-6 ml-4"/>
                </Link>
                <Link to="/profile" className='self-end'>
                    <img src="/images/infoButton.png" alt="Profile" className="w-10 h-10 mr-4" />
                </Link>
            </div>

            {/* 박스 추가 */}
            <div className="mt-4 bg-gray-100">
                {/* 박스 내부의 내용을 여기에 추가하세요 */}
                <p className="text-center text-gray-700"> 📣 공지사항 : 2024년 12월 20일 앱 배포 📣 </p>
            </div>
        </header>
    );
};

export default Header;
