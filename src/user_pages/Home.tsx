import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="flex justify-around items-center w-full max-w-lg mx-auto p-4 text-black bottom-0 min-h-screen overflow-y-auto">
            <div className="container mx-auto p-6">
                {/* Notice */}
                <div className="border-b border-gray-300 pb-4 mb-4">
                    <h2 className="text-lg font-semibold">공지사항 :</h2>
                </div>
                {/* Genre */}
                <div className="flex flex-col items-center space-y-6">
                    <div className="w-full max-w-md">
                        <div className="text-left font-semibold rounded-md opacity-90 mb-2">
                            # 추리 # 미스테리
                        </div>
                        <div className="border rounded-lg overflow-hidden shadow-lg">
                            <img 
                                src="/images/choori.png" 
                                alt="Mystery" 
                                className="w-full h-64 object-cover"
                            />
                        </div>
                    </div>
                    
                    <div className="w-full max-w-md">
                        <div className="text-left font-semibold rounded-md opacity-90 mb-2">
                            # 로맨스 # 판타지
                        </div>
                        <div className="border rounded-lg overflow-hidden shadow-lg">
                            <img 
                                src="/images/love.png" 
                                alt="Romance" 
                                className="w-full h-64 object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
   
};

export default Home;