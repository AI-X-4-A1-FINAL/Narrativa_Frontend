import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="w-full p-8 text-black min-h-screen overflow-y-auto">
            <div className="w-full space-y-6">
                {/* Genre */}
               
                    
                    {/* 첫 번째 이미지 */}
                    <div className="w-full max-w-lg max-h-md mx-auto">
                        <div className="text-left font-semibold opacity-90 mb-2">
                            #추리 #소설
                        </div>
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                        <img 
                            src="/images/choori.jpeg" 
                            alt="Romance Genre Cover" 
                            className="w-full h-[600px] rounded-2xl object-cover"
                         />
                    </div>
                    </div>

                    
                    {/* 두 번째 이미지 */}
                    <div className="w-full">
                        <div className="text-left font-semibold opacity-90">
                            # 로맨스 # 판타지
                        </div>
                        <div className=" rounded-lg overflow-hidden shadow-lg">
                            <img 
                                src="/images/love.png" 
                                alt="Romance Genre Cover" 
                                className="w-full h-[600px] "
                            />
                        </div>
                    </div>
                    
                    {/* 세 번째 이미지 */}
                    <div className="w-full">
                        <div className="text-left font-semibold opacity-90">
                            # 추리 # 미스테리
                        </div>
                        <div className=" rounded-lg overflow-hidden shadow-lg">
                            <img 
                                src="/images/raise.png" 
                                alt="Mystery Genre Cover" 
                                className="w-full h-[600px] "
                            />
                        </div>
                    </div>
                    
                    {/* 네 번째 이미지 */}
                    <div className="w-full">
                        <div className="text-left font-semibold opacity-90">
                            # 로맨스 # 판타지
                        </div>
                        <div className=" rounded-lg overflow-hidden shadow-lg">
                            <img 
                                src="/images/detective.jpg" 
                                alt="Romance Genre Cover" 
                                className="w-full h-[600px]"
                            />
                        </div>
                    </div>
                
            </div>
        </div>
    );
};

export default Home;
