import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    // 장르 선택 함수
    const handleClick = (genre: string, tags: string[], image: string) => {
        navigate('/game-intro', {
            state: {
                genre,
                tags,
                image,
            },
        });
    };
    
    return (
        <div className="flex justify-around items-center w-full max-w-lg mx-auto p-4 text-black bottom-0 min-h-screen overflow-y-auto">
            <div className="container mx-auto p-6">
                <div className="border-b border-gray-300 pb-4 mb-4">
                    <h2 className="text-lg font-semibold">공지사항 :</h2>
                </div>
                <div className="flex flex-col items-center space-y-6">
                    <div className="w-full max-w-md">
                        <div className="text-left font-semibold opacity-90">
                                #추리 #미스테리
                        </div>
                        <div
                            className="border rounded-lg overflow-hidden shadow-lg cursor-pointer"
                            onClick={() => handleClick('추리', ['추리', '미스테리'], '/images/choori.png')}
                        >

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

                    
                    <div className="w-full max-w-md">
                        <div className="text-left font-semibold opacity-90">
                                #연애 #로맨스 #판타지
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
                        <div
                                className="border rounded-lg overflow-hidden shadow-lg cursor-pointer"
                                onClick={() => handleClick('연애', ['연애', '시뮬레이션', '로맨스'], '/images/love.png')}
                            >
                                <img 
                                    src="/images/love.png" 
                                    alt="Romance" 
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                        
                    </div>
                
            </div>
        </div>
    );

};

export default Home;
