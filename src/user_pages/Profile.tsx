import React from 'react';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
    return (
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
