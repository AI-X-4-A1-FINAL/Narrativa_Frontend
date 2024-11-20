import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null); // Reference to the menu container

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        // Attach the event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Conditional rendering: don't render the header on the home page
    if (location.pathname === "/") {
        return null;
    }

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleMenuItemClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="flex flex-col items-center w-full max-w-lg mx-auto p-4 text-black fixed top-0 bg-white z-10">
            {/* 상단 이미지 컨테이너 */}
            <div className="flex justify-between items-center w-full">
                <Link to="/home">
                    <img src="/images/Group 18317.png" alt="Bookmarks" className="h-14 " />
                </Link>

                {/* 프로필 아이콘 및 드롭다운 메뉴 */}
                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={toggleMenu} 
                        className="self-end focus:outline-none"
                        aria-haspopup="true" 
                        aria-expanded={isMenuOpen}
                    >
                        <img src="/images/nav.png" alt="Profile" className="w-8 mt-4" />
                    </button>
                    
                    {/* 드롭다운 메뉴 */}
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg transition ease-out duration-200">
                            <ul className="flex flex-col p-2">
                                <li>
                                    <Link 
                                        to="/profile" 
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                        onClick={handleMenuItemClick} // 클릭 시 드롭다운 닫기
                                    >
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        to="/bookmarks" 
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                        onClick={handleMenuItemClick} // 클릭 시 드롭다운 닫기
                                    >
                                        History
                                    </Link>
                                </li>
                                
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* 공지사항: Home 페이지에서만 렌더링 */}
            {location.pathname === "/home" && (
                <div className="mt-1 bg-gray-100 text-center p-2 rounded-lg">
                    <p className="text-gray-700 text-sm"> 📣 공지사항 : 2024년 12월 20일 앱 출시 📣 </p>
                </div>
            )}
        </header>
    );
};

export default Header;
