import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
    const location = useLocation();

    if (location.pathname === "/") {
        return null;
    }
    return (
        <header className="flex justify-around items-center w-full max-w-lg mx-auto p-4 text-black fixed top-0 h-16 bg-white" font-custom>
            <Link to="/home">
                <span className="text-4xl font-custom-font font-bold mr-auto">Narrativa</span>
            </Link>
            <Link to="/profile">
                <img src="/images/myinfobutton.png" alt="Bookmarks" className="w-8 h-8" />
            </Link>

        </header>
    );
};

export default Header;
