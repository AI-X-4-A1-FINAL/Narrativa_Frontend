import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="w-full p-4 text-black min-h-screen overflow-y-auto">
            <div className="w-full p-6 space-y-6">
                {/* Genre */}
                <div className="flex flex-col items-center space-y-6">
                    
                    {/* 첫 번째 이미지 */}
                    <div className="w-full">
                        <div className="text-left font-semibold opacity-90">
                            #추리 #소설
                        </div>
                        <div className="border rounded-lg overflow-hidden shadow-lg">
                            <img 
                                src="/images/image 63.png" 
                                alt="Romance Genre Cover" 
                                className="w-full"
                            />
                        </div>
                    </div>
                    
                    {/* 두 번째 이미지 */}
                    <div className="w-full">
                        <div className="text-left font-semibold opacity-90">
                            # 로맨스 # 판타지
                        </div>
                        <div className="border rounded-lg overflow-hidden shadow-lg">
                            <img 
                                src="/images/image 63.png" 
                                alt="Romance Genre Cover" 
                                className="w-full"
                            />
                        </div>
                    </div>
                    
                    {/* 세 번째 이미지 */}
                    <div className="w-full">
                        <div className="text-left font-semibold opacity-90">
                            # 추리 # 미스테리
                        </div>
                        <div className="border rounded-lg overflow-hidden shadow-lg">
                            <img 
                                src="/images/image 63.png" 
                                alt="Mystery Genre Cover" 
                                className="w-full object-cover h-64 md:h-80 lg:h-96"
                            />
                        </div>
                    </div>
                    
                    {/* 네 번째 이미지 */}
                    <div className="w-full">
                        <div className="text-left font-semibold opacity-90">
                            # 로맨스 # 판타지
                        </div>
                        <div className="border rounded-lg overflow-hidden shadow-lg">
                            <img 
                                src="/images/image 63.png" 
                                alt="Romance Genre Cover" 
                                className="w-full object-cover h-64 md:h-80 lg:h-96"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
