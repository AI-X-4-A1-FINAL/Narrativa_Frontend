import React, { useEffect } from "react";
import { X } from "lucide-react"; // 닫기 아이콘 사용
import classNames from "classnames";

interface InfoProps {
  position: "center" | "left";
  onToggle: () => void; // 모달을 닫는 함수
}

const InfoModal: React.FC<InfoProps> = ({ position, onToggle }) => {
  // ESC 키를 눌렀을 때 모달 닫기
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onToggle();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [onToggle]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* 모달 박스 */}
      <div
        className={classNames(
          "relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg",
          {
            "mx-auto": position === "center", // 중앙 정렬
            "ml-0": position === "left", // 왼쪽 정렬
          }
        )}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onToggle}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        {/* 모달 제목 */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          챗봇 사용법 안내
        </h2>

        {/* 사용법 내용 */}
        <div className="text-gray-600 leading-relaxed">
          <p>
            게임에 대한 설명을 도와주는 <strong>AI 챗봇</strong>이 있습니다.
          </p>
          <p className="mt-2">
            궁금한 사항이나 게임 플레이에 대한 정보를 얻고 싶다면 챗봇에게
            질문해 보세요. 🎮
          </p>
          <ul className="mt-3 list-disc list-inside">
            <li>챗봇은 게임의 규칙과 스토리를 안내합니다.</li>
            <li>간단한 질문을 입력하면 답변을 받을 수 있어요.</li>
          </ul>
        </div>

        {/* 확인 버튼 */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onToggle}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
