import React from 'react';

const Bookmarks: React.FC = () => {
    return (
        <div className="bg-white text-gray-800 p-8 min-h-screen">
            <div className="w-full mx-auto">
                {/* Genre Selection Section */}
                <div
                    className="w-full bg-gray-200 p-4 mb-9 flex justify-around items-center"
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
                <div className="grid grid-cols-2 gap-6">
                    <div className="rounded-lg overflow-hidden">
                        <img 
                            src="images/choori.png" 
                            alt="Couple" 
                            className="w-full object-cover h-54" 
                        />
                    </div>
                    <div className="rounded-lg overflow-hidden">
                        <img 
                            src="images/choori.png" 
                            alt="Couple" 
                            className="w-full object-cover h-54" 
                        />
                    </div>
                    <div className="rounded-lg overflow-hidden">
                        <img 
                            src="images/choori.png" 
                            alt="Couple" 
                            className="w-full object-cover h-54" 
                        />
                    </div>
                    <div className="rounded-lg overflow-hidden">
                        <img 
                            src="images/choori.png" 
                            alt="Couple" 
                            className="w-full object-cover h-54" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bookmarks;
