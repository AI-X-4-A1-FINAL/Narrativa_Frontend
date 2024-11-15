import React, { useState } from 'react';

const Bookmarks: React.FC = () => {
    // 현재 선택된 장르를 관리하는 상태
    const [selectedGenre, setSelectedGenre] = useState('추리');

    // 각 장르에 대한 이미지 데이터
    const genreImages: { [key: string]: string[] } = {
        추리: ['images/choori.png', 'images/choori2.png', 'images/choori3.png', 'images/choori4.png'],
        공포: ['images/horror1.png', 'images/horror2.png', 'images/horror3.png', 'images/horror4.png'],
        연애: ['images/romance1.png', 'images/romance2.png', 'images/romance3.png', 'images/romance4.png'],
        성장: ['images/growth1.png', 'images/growth2.png', 'images/growth3.png', 'images/growth4.png'],
    };

    return (
        <div className="bg-white text-gray-800 p-8 min-h-screen">
            <div className="w-full mx-auto">
                {/* Genre Selection Section */}
                <div
                    className="w-full p-4 mb-9 flex justify-around items-center"
                    style={{
                        borderRadius: '50px',
                        height: '50px',
                    }}
                >
                    {Object.keys(genreImages).map((genre) => (
                        <button
                            key={genre}
                            className={`text-black px-4 py-2 w-1/4 text-center rounded-full hover:bg-custom-purple hover:text-white ${
                                selectedGenre === genre ? 'bg-custom-purple text-white' : ''
                            }`}
                            style={{ borderRadius: '50px' }}
                            onClick={() => setSelectedGenre(genre)}
                        >
                            {genre}
                        </button>
                    ))}
                </div>

                {/* Image Grid Section */}
                <div className="grid grid-cols-2 gap-6">
                    {genreImages[selectedGenre].map((image, index) => (
                        <div key={index} className="rounded-lg overflow-hidden">
                            <img 
                                src={image} 
                                alt={`${selectedGenre} ${index + 1}`} 
                                className="w-full object-cover h-54" 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Bookmarks;
