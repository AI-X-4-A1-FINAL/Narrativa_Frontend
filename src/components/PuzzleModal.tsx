import React, { useState, useEffect, useRef } from "react";
import S from "../layouts/Style.Puzzle";
import ImageDivide from "../hooks/image_divide";
import usePuzzle from "../hooks/usePuzzle";
import { useMultipleSoundEffects } from "../hooks/useMultipleSoundEffects";
import countDownLottie from "./countdown.json"; // Lottie JSON file
import Lottie from 'lottie-react'; // lottie-react 라이브러리에서 가져오기


interface PuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
  bgImage: string;
}

const PuzzleModal: React.FC<PuzzleModalProps> = ({
  isOpen,
  onClose,
  bgImage,
}) => {
  const [pieces, setPieces] = useState<string[]>([]);
  const { puzzle, dragEnter, dragStart, drop, scale } = usePuzzle(
    pieces,
    onClose
  );
  const [isGameFinished, setIsGameFinished] = useState(false);
  const { playSound } = useMultipleSoundEffects(["/audios/button1.mp3"]);
  
  // 터치 관련 상태 및 ref
  const [touchedPiece, setTouchedPiece] = useState<number | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const puzzleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [countdown, setCountdown] = useState(5); // 카운트다운 상태

  const handlePiecesGenerated = (newPieces: string[]) => {
    setPieces(newPieces);
  };

  // 특정 좌표에 있는 퍼즐 조각 찾기
  const findPuzzlePieceAtPosition = (x: number, y: number) => {
    return puzzleRefs.current.findIndex((ref) => {
      if (!ref) return false;
      const rect = ref.getBoundingClientRect();
      return (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      );
    });
  };

  // 터치 이벤트 핸들러
  const handleTouchStart = (idx: number, e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    setTouchedPiece(idx);
    dragStart(idx);
    playSound(1);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchedPiece === null || !touchStartPos.current) return;

    const touch = e.touches[0];
    const currentPiece = findPuzzlePieceAtPosition(touch.clientX, touch.clientY);

    

    if (currentPiece !== -1 && currentPiece !== touchedPiece) {
      dragEnter(currentPiece);
      playSound(2);
    }
  };

  const handleTouchEnd = () => {
    if (touchedPiece !== null) {
      drop();
      playSound(3);
      setTouchedPiece(null);
      touchStartPos.current = null;
    }
  };

  // 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // 카운트다운 타이머
  useEffect(() => {
    if (isOpen) {
      setCountdown(10); // 모달이 열릴 때 10초로 초기화
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer); // 타이머 정지
            onClose(); // 타이머 종료 후 모달 닫기
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
    }
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-[#020202] p-6 rounded-lg shadow-lg max-w-lg w-full h-full">
            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={() => {
                playSound(0);
                onClose();
              }}
            >
              &times;
            </button>

            <h1 className="text-center text-xl font-semibold">PUZZLE GAME</h1>
            <div className="text-center dark:text-gray-300 text-white mb-8" >
              마우스나 터치로 드래그해서 퍼즐을 맞춰주세요
            </div>

            {/* 카운트다운 표시 */}
            <div className="text-center text-3xl text-custom-violet font-bold mb-12">
              남은 시간: {countdown}초
            </div>

            {/* Lottie 애니메이션과 퍼즐 영역을 같은 컨테이너에 배치 */}
            {/* <div className="flex items-center justify-center w-full h-full m-0 p-0">
              <Lottie
                animationData={countDownLottie}
                loop={false}
                autoplay={true}
                className="w-[40svh] h-[40svh] object-contain" // 애니메이션 크기 조정 및 object-contain 추가
              />
            </div> */}



            <ImageDivide
              imageSrc={bgImage}
              onPiecesGenerated={handlePiecesGenerated}
            />

            <S.Position>
              {puzzle.map(({ num, url }, idx) => (
                <S.PuzzleBox
                  key={idx}
                  ref={(el) => (puzzleRefs.current[idx] = el)}
                  gridArea={idx}
                  hoverScale={scale}
                  // 기존 드래그 이벤트
                  onDragStart={() => {
                    playSound(1);
                    dragStart(idx);
                  }}
                  onDragEnter={() => {
                    playSound(2);
                    dragEnter(idx);
                  }}
                  onDragOver={(e: React.DragEvent<HTMLDivElement>) =>
                    e.preventDefault()
                  }
                  onDragEnd={() => {
                    playSound(3);
                    drop();
                  }}
                  // 터치 이벤트
                  onTouchStart={(e) => handleTouchStart(idx, e)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
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