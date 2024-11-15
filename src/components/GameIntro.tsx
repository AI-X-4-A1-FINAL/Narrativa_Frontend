import React from 'react';
import { useLocation } from 'react-router-dom';

interface LocationState {
    genre: string;
    tags: string[];
    image: string;
}

const GameIntro: React.FC = () => {
    const location = useLocation();
    const { genre, tags, image } = location.state as LocationState;

    const startGame = () => {
        alert('Game Starting...');
    };

    return (
        <div className="bg-white flex flex-col items-center justify-center min-h-screen">
            <div className="border-2 border-gray-300 rounded-lg h-48 mb-4 flex items-center justify-center">
                <img src={image} alt={genre} className="w-full h-full object-cover" />
            </div>
            <p className="text-gray-700 text-center mb-4">
                {tags.map((tag, index) => (
                    <span   
                        key={index}
                        className="inline-block text-gray-700 text-sm font-semibold mr-2 px-3 py-1 rounded-full"
                    >
                        #{tag}
                    </span>
                ))}
                <br />
                여기는 해당 게임 설명 창입니다.<br />
                이런식으로 텍스트가 추가될 예정이에요.<br />
                생존.. 잘 하시길 굿럭
            </p>

            {/* Start Button */}
            <button
                onClick={startGame}
                className="bg-custom-purple text-white font-bold py-2 px-4 rounded w-full hover:bg-blue-900 transition duration-200"
            >
                start
            </button>
        </div>
    );
};

export default GameIntro;
