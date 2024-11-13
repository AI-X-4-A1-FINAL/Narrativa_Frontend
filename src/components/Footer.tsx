import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
    const location = useLocation();

    if (location.pathname === "/") {
        return null;
    }
    return (
        <footer className="flex justify-around items-center w-full max-w-lg mx-auto p-4 bg-black text-white fixed bottom-0 h-16">
            <Link to="/bookmarks">
                <img src="/images/Bookmark.png" alt="Bookmarks" className="w-8 h-8" />
            </Link>

            <Link to="/home">
                <img src="/images/Home.png" alt="Home" className="w-8 h-8" />
            </Link>
            <Link to="/settings">
                <img src="/images/Setting.png" alt="Settings" className="w-8 h-8" />
            </Link>
        </footer>
    );
};

export default Footer;
