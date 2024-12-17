import React, { useEffect } from "react";
import { X } from "lucide-react"; // 닫기 아이콘 사용

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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
      {/* 모달 박스 */}
      <div
        className={`relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg ${
          position === "center" ? "mx-auto" : "ml-0"
        }`}
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
          <img
            src="/infomodallogo.webp"
            alt="AI 챗봇 안내 이미지"
            className="w-32 h-32 mx-auto mb-4 rounded"
          />
          <p>
            게임에 대한 설명을 도와주는 <strong>AI 챗봇</strong>이 있습니다.
          </p>
          <p className="mt-2">
            생존 확률을 높이고 싶다면 힌트를 확인해 보세요. 🎮
          </p>
          <ul className="mt-3 list-disc list-inside">
            <li>높이는 선택지에 대한 힌트를 제공합니다.</li>
            <li>힌트를 확인하고 현명한 결정을 내려보세요.</li>
          </ul>
        </div>

        {/* 확인 버튼 */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onToggle}
            className="px-4 py-2 bg-custom-violet text-white rounded hover:bg-blue-700"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
