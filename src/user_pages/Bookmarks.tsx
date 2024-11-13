import React from 'react';

const Bookmarks: React.FC = () => {
    return (
        <div className="bg-white text-gray-800 p-9 min-h-screen">
            <div className="container mx-auto">
                {/* Genre Selection Section with Background Image */}
                <div
                    className="w-full max-w-lg mx-4 bg-gray-200 p-4 mb-9 flex justify-around items-center"
                    style={{
                        borderRadius: '50px', // 큰 사각형의 모서리를 둥글게
                        height: '50px',       // 높이 조정
                    }}
                >
                    <button
                        className="text-black px-4 py-2 w-1/4 text-center rounded-full hover:bg-white hover:text-blue-500"
                        style={{ borderRadius: '50px' }}
                    >
                        추리
                    </button>
                    <button
                        className="text-black px-4 py-2 w-1/4 text-center rounded-full hover:bg-white hover:text-blue-500"
                        style={{ borderRadius: '50px' }}
                    >
                        공포
                    </button>
                    <button
                        className="text-black px-4 py-2 w-1/4 text-center rounded-full hover:bg-white hover:text-blue-500"
                        style={{ borderRadius: '50px' }}
                    >
                        연애
                    </button>
                    <button
                        className="text-black px-4 py-2 w-1/4 text-center rounded-full hover:bg-white hover:text-blue-500"
                        style={{ borderRadius: '50px' }}
                    >
                        성장
                    </button>

                </div>
 

                {/* Image Grid Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-pink-200 rounded-lg p-4 flex items-center justify-center">
                        <img src="https://source.unsplash.com/random/200x200/?couple" alt="Couple" className="rounded-lg" />
                    </div>
                    <div className="bg-pink-200 rounded-lg p-4 flex items-center justify-center">
                        <img src="https://source.unsplash.com/random/200x200/?couple" alt="Couple" className="rounded-lg" />
                    </div>
                    <div className="bg-pink-200 rounded-lg p-4 flex items-center justify-center">
                        <img src="https://source.unsplash.com/random/200x200/?couple" alt="Couple" className="rounded-lg" />
                    </div>
                    <div className="bg-pink-200 rounded-lg p-4 flex items-center justify-center">
                        <img src="https://source.unsplash.com/random/200x200/?couple" alt="Couple" className="rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bookmarks;
