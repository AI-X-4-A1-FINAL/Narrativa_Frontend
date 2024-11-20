import React from "react";
import html2canvas from "html2canvas";
import { FaDownload } from "react-icons/fa";

const GameEnding: React.FC = () => {
  const handleDownload = async () => {
    // 캡처할 영역과 다운로드 버튼 선택
    const captureArea = document.querySelector(".capture-area");
    const downloadButton = document.querySelector(".download-button");

    if (!captureArea) return;

    // 다운로드 버튼 숨기기
    if (downloadButton) {
      (downloadButton as HTMLElement).style.visibility = "hidden";
    }

    // html2canvas로 특정 영역 캡처
    const canvas = await html2canvas(captureArea as HTMLElement);

    // 숨긴 다운로드 버튼 복원
    if (downloadButton) {
      (downloadButton as HTMLElement).style.visibility = "visible";
    }

    // 캡처된 이미지를 JPG로 변환 및 다운로드
    const dataUrl = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "game-section.jpg";
    link.click();
  };

  return (
    <div className="capture-area relative w-full p-8 text-black min-h-screen overflow-y-auto bg-gray-50">
      {/* 다운로드 버튼 */}
      <button
        onClick={handleDownload}
        className="download-button absolute top-4 right-4 bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300 transition"
        title="Download Page"
      >
        <FaDownload size={20} />
      </button>

      {/* 콘텐츠 */}
      <div className="text-center p-6">
        <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden">
          <span className="text-gray-400">Game Image Placeholder</span>
        </div>

        {/* 태그 */}
        <div className="text-center text-gray-700 mt-4">
          <p className="text-lg font-semibold"># 생존</p>
          <p className="text-lg font-semibold"># 아포칼립스</p>
        </div>

        {/* 설명 */}
        <p className="text-gray-700 mt-4">
          여기는 해당 게임 설명 창입니다.
          <br />
          이런식으로 텍스트가 추가될 예정이에오
          <br />
          생존.. 잘 하시길 굿럭
        </p>
      </div>
    </div>
  );
};

export default GameEnding;
