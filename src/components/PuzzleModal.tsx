import React, { useState } from "react";
import S from '../layouts/Style.Puzzle';
import ImageDivide from '../hooks/image_divide'; // ImageDivide 컴포넌트 import
import usePuzzle from '../hooks/usePuzzle'; // 퍼즐 상태 관리 훅

interface PuzzleModalProps {
  isOpen: boolean; // 모달 열림 상태
  onClose: () => void; // 모달 닫기 함수
  bgImage: string;
}

const PuzzleModal: React.FC<PuzzleModalProps> = ({
  isOpen,
  onClose,
  bgImage,
}) => {
  const [pieces, setPieces] = useState<string[]>([]); // 분할된 이미지 조각들 저장
  const { puzzle, dragEnter, dragStart, drop, scale } = usePuzzle(pieces, onClose); // usePuzzle 훅으로 퍼즐 상태 관리
  const [isGameFinished, setIsGameFinished] = useState(false); // 게임 완료 상태

  // ImageDivide에서 6등분된 이미지 조각을 받는 콜백
  const handlePiecesGenerated = (newPieces: string[]) => {
    setPieces(newPieces); // 조각 상태 업데이트
  };

  const handleGameComplete = () => {
    setIsGameFinished(true); // 게임 완료로 상태 변경
  };

  return (
    <>
      {/* 배경 오버레이 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-black p-6 rounded-lg shadow-lg max-w-lg w-full">
             <button
              className="text-gray-500 hover:text-gray-800"
              onClick={onClose}
            >
              &times;
            </button> 

            <h1 className="text-center text-xl font-semibold">퍼즐을 맞춰라!!!</h1> 
            
            

            {/* 이미지 조각 생성 */}
            <ImageDivide 
              imageSrc={bgImage}
              onPiecesGenerated={handlePiecesGenerated} 
            />

            {/* 퍼즐 게임 */}
            <S.Position>
              {puzzle.map(({ num, url }, idx) => (
                <S.PuzzleBox
                  key={idx}
                  gridArea={idx}
                  hoverScale={scale}
                  onDragStart={() => dragStart(idx)}
                  onDragEnter={() => dragEnter(idx)}
                  onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
                  onDragEnd={drop}
                  draggable
                >
                  <S.PuzzleImg src={url} alt={`${num}조각`} />
                </S.PuzzleBox>
              ))}
            </S.Position>
          </div>
        </div>
      )}
    </>
  );
};

export default PuzzleModal;