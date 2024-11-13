import React from 'react';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
    return (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto pt-4 text-black">
            <div className="w-80 h-80 border-4 border-gray-300 rounded-full mb-7">
            <img src="/images/pikachu.jpg" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-4xl font-bold mb-3 pt-5">Pikachu</h1>
            <p className="text-xl mb-4">hi good to see you</p>
            <div className="flex space-x-4">
                <button className="px-5 py-1 text-black border border-grey rounded hover:bg-pink-50-600">수정</button>
            </div>
            <div className="text-sm text-gray-500 space-x-2 pt-1">
                <Link to="/delete-account" className="hover:underline">회원탈퇴</Link>
                <span>|</span>
                <Link to="/logout" className="hover:underline">로그아웃</Link>
            </div>

        </div>
    );
};

export default Profile;
